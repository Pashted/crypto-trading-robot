const path = require('path'),
    db = require('../../models/database'),
    multiplies = require('../../components/storage/data/timeframes'),

    bufferLimit = 1;  // batch size for queries

module.exports = {


    /**
     * Get candles from exchange
     * @param request
     * @returns {Promise<*|{volume, ohlc}>}
     */
    async get(request) {

        let start = new Date(request.start).getTime(), // convert date fields to timestamp
            end = (request.end ? new Date(request.end) : new Date()).getTime();

        const { exchange, _send, action, symbol, pair, timeframe } = request,
            ticker = symbol + pair,

            Exchange = require(path.resolve(__dirname, `../../models/exchange/${exchange}`)),

            filter = { exchange, ticker, timeframe },
            sort = { start: 1 },

            shift = multiplies[timeframe] * 60000, // expected length of 1 candle in timestamp format

            tick = progress => _send({
                event:    action,
                infinity: true,
                data:     { progress }
            }),

            params = { Exchange, tick, ticker, filter, start, end, shift };


        // get saved candles
        let candles = await db.get('candles', filter, sort);


        if (!candles) {
            // if db has not any candle for this context, get them all from exchange
            candles = await this.getFromLeft({ ...request, ...params });


        } else {
            // if db already stores some candles for this context

            candles = Array.isArray(candles)
                      ? candles.reduce((res, { data }) => [ ...res, data ], [])
                      : [ candles.data ];

            let [ savedStart ] = candles[0][0],
                [ savedEnd ] = candles.slice(-1)[0].slice(-1)[0];

            savedStart -= shift; // shift to the older group
            savedEnd += shift; // shift to the younger group


            let leftCandles = [], rightCandles = [];


            // if client asked older candles
            if (start < savedStart)
                leftCandles = await this.getFromLeft({ ...request, ...params, start, end: savedStart });


            // if client asked younger candles
            if (savedEnd < end)
                rightCandles = await this.getFromLeft({ ...request, ...params, start: savedEnd, end });


            //  merge new candles groups with the rest
            candles = [ ...leftCandles, ...candles, ...rightCandles ];

        }

        tick(100);


        if (candles.length) {

            const [ ts1 ] = candles[0][0],
                [ ts2 ] = candles.slice(-1)[0].slice(-1)[0];

            // combine arrays to object for making empty candles
            candles = candles.reduce((res, data) => {
                data.forEach(candle => res[candle[0]] = candle);
                return res;
            }, {});


            if (timeframe === '1M')
                return Exchange.formatMonthCandles(candles);

            else
                return Exchange.formatCandles({ candles, shift, ts: ts1, stop: ts2 });

        } else {
            throw new Error("Can't get candles from anywhere");
        }
    },


    /**
     * Get candles from start to end
     */
    async getFromLeft({ Exchange, tick, filter, timeframe, ticker, start, end, shift }) {

        let data = [],
            buffer = [],
            finish = false,
            expected = end - start,
            progress = 0;

        while (!finish) {
            buffer.push(Exchange.getCandles({ timeframe, ticker, start, end }));

            start += Exchange.limit * shift; // shift to the younger group
            finish = start >= end;

            // if we reached buffer limit or the loop will finish now
            if (buffer.length >= bufferLimit || finish) {

                if (!finish) {
                    console.log(`...${bufferLimit / Exchange.rate} seconds delay to avoid ban for spam`);
                    await new Promise(res => setTimeout(res, bufferLimit / Exchange.rate * 1000));
                }

                console.log('...wait data from exchange');
                const candles = (await Promise.all(buffer))
                    .filter(arr => arr.length);


                if (candles.length) {
                    start = candles.slice(-1)[0].slice(-1)[0][0] + shift;
                    finish = start >= end;

                    progress = expected - (end - start);

                    // tell client current progress
                    tick(Math.round(progress / expected * 100));
                }


                this.save({ filter, candles });

                data = [ ...data, ...candles ];

                buffer = [];
            }
        }

        return data;
    },


    /**
     *
     * @param candles {Array}
     * @param limit {Number}
     */
    save({ candles, filter }) {

        candles.forEach(data => {
            let period = {
                start: data[0][0],
                end:   data.slice(-1)[0][0]
            };
            db.set(
                'candles',
                { ...filter, ...period },
                { ...filter, ...period, data }
            );
        });
    }

};