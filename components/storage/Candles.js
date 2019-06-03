const path = require('path'),
    db = require('../../models/database'),
    multiplies = require('../../components/storage/data/timeframes');

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
            candles = await this.getFromLeft({ ...request, ticker, start, end, shift, Exchange });

            this.save({ filter, candles });


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

            // console.log('req.Start :', start);
            // console.log('savedStart:', savedStart);
            // console.log('savedEnd  :', savedEnd);
            // console.log('req.End   :', end);


            let leftCandles = [], rightCandles = [];


            // if client asked older candles
            if (start < savedStart) {
                leftCandles = await this.getFromRight({ ...request, ticker, start, end: savedStart, shift, Exchange });

                this.save({ filter, candles: leftCandles });
            }

            // if client asked younger candles
            if (savedEnd < end) {
                rightCandles = await this.getFromLeft({ ...request, ticker, start: savedEnd, end, shift, Exchange });

                this.save({ filter, candles: rightCandles });
            }


            //  merge new candles groups with the rest
            candles = [ ...leftCandles, ...candles, ...rightCandles ];

        }


        if (candles) {
            // merge with filter of duplicates
            candles = candles.reduce((result, data) => [
                ...result,
                ...data.filter(new_candle => {
                    // add new candle if it no includes in the result
                    let res = result.reduceRight((add, candle) => add && !candle.includes(new_candle[0]), true);
                    if (!res)
                        console.log('-- Duplication candle caught!', new_candle[0]);
                    return res;
                })
            ], []);

            return Exchange.formatCandles(candles, shift);


        } else {
            throw new Error("Can't get candles from anywhere");
        }
    },


    /**
     * Get candles from start to end
     */
    async getFromLeft({ Exchange, timeframe, ticker, start, end, shift }) {

        const stop = end;

        let data = [];

        do {
            end = start + (shift * Exchange.limit);

            // don't ask younger than required
            if (end > stop)
                end = stop;

            const res = await Exchange.getCandles({ timeframe, ticker, start, end });

            // it seems we will not give the data due to some non-critical error
            if (res === null)
                break;

            // if there is any trade action happened at this period
            if (res.length)
                data.push(res);


            // shift to the younger group
            start = end + shift;


        } while (end < stop);


        return data;
    },


    /**
     * Get candles from end to start
     */
    async getFromRight({ Exchange, timeframe, ticker, start, end, shift }) {

        const stop = start;

        let data = [];

        do {
            start = end - (shift * Exchange.limit);

            // don't ask earlier than required
            if (stop > start)
                start = stop;

            const res = await Exchange.getCandles({ timeframe, ticker, start, end });

            // it seems we will not give the data due to some non-critical error
            if (res === null)
                break;

            // if there is any trade action happened at this period
            if (res.length)
                data = [ res, ...data ]; // prepend older candles to the rest


            // shift to the older group
            end = start - shift;


        } while (stop < start);

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