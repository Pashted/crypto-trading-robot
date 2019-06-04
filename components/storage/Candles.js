const path = require('path'),
    db = require('../../models/database'),
    multiplies = require('../../components/storage/data/timeframes'),

    bufferLimit = 3;  // batch size for queries

module.exports = {


    /**
     * Get candles from exchange
     * @param request
     * @returns {Promise<*|{volume, ohlc}>}
     */
    async get(request) {

        let start = new Date(request.start).getTime(), // convert date fields to timestamp
            end = (request.end ? new Date(request.end) : new Date()).getTime();

        const { exchange, symbol, pair, timeframe } = request,
            Exchange = require(path.resolve(__dirname, `../../models/exchange/${exchange}`)),
            ticker = symbol + pair,

            filter = { exchange, ticker, timeframe },
            sort = { start: 1 },

            shift = multiplies[timeframe] * 60000; // expected length of 1 candle in timestamp format


        // get saved candles
        let candles = await db.get('candles', filter, sort);


        if (!candles) {
            // if db has not any candle for this context, get them all from exchange
            candles = await this.getFromLeft({ ...request, ticker, start, end, shift, Exchange, filter });


        } else {
            // if db already stores some candles for this context

            candles = Array.isArray(candles)
                      ? candles.reduce((res, { data }) => [ ...res, data ], [])
                      : [ candles.data ];


            const [ group1 ] = candles, [ groupN ] = candles.slice(-1),
                [ candle1 ] = group1, [ candleN ] = groupN.slice(-1);

            let [ savedStart ] = candle1, [ savedEnd ] = candleN;

            savedStart -= shift; // shift to the older group
            savedEnd += shift; // shift to the younger group


            let leftCandles = [], rightCandles = [];


            // if client asked older candles
            if (start < savedStart)
                leftCandles = await this.getFromLeft({ ...request, ticker, start, end: savedStart, shift, Exchange, filter });


            // if client asked younger candles
            if (savedEnd < end)
                rightCandles = await this.getFromLeft({ ...request, ticker, start: savedEnd, end, shift, Exchange, filter });


            //  merge new candles groups with the rest
            candles = [ ...leftCandles, ...candles, ...rightCandles ];

        }


        if (candles) {
            return Exchange.formatCandles(candles, shift);

        } else {
            throw new Error("Can't get candles from anywhere");
        }
    },


    /**
     * Get candles from start to end
     */
    async getFromLeft({ Exchange, _send, action, filter, timeframe, ticker, start, end, shift }) {

        let data = [],
            buffer = [],
            finish = false,
            expected = Math.ceil((end - start) / shift),
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
                    .filter(arr => {
                        progress += arr.length;
                        return arr.length;
                    });

                this.save({ filter, candles });

                data = [ ...data, ...candles ];


                // tell client current progress
                _send({
                    event:    action,
                    infinity: true,
                    data:     {
                        progress: Math.round(progress / expected * 100)
                    }
                });

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