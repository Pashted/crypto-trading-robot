const /*BFX = require('bitfinex-api-node'),*/
    request = require('request');


// console.log(">> BFX ", BFX);


module.exports = {
    url: "https://api-pub.bitfinex.com/v2/",

    key: "",

    limit: 5000, // query results limit

    getSymbols() {
        return new Promise(resolve => {
            request.get(
                this.url + '/conf/pub:list:pair:exchange',
                (error, response, body) => {
                    if (error)
                        throw error;

                    let data = {},
                        result = JSON.parse(body);

                    if (result.error)
                        throw result.error;

                    if (result instanceof Array)
                        result = result[0];

                    console.log('<- Exchange symbols response', result.length, result);

                    result.forEach(symbol => {

                        let cur = symbol.substr(0, 3), // first currency in pair
                            pair = symbol.substr(3); // second currency in pair

                        if (!data[cur]) // if found currency 1st time
                            data[cur] = [pair];

                        else if (!data[cur].includes(pair)) // if found pair 1st time
                            data[cur].push(pair);
                    });

                    resolve(data);
                }
            );
        });
    },


    async getCandles({ symbol, pair, timeframe, start, end }) {

        pair = 't' + symbol + pair;
        start = new Date(start).getTime();
        end = (end ? new Date(end) : new Date()).getTime();

        let diff = (end - start) / 1000 / 60, // range in minutes
            multiplies = {
                '1m':  1,
                '5m':  5,
                '15m': 15,
                '30m': 30,
                '1h':  60,
                '3h':  60 * 3,
                '6h':  60 * 6,
                '12h': 60 * 12,
                '1D':  60 * 24,
                '7D':  60 * 24 * 7,
                '14D': 60 * 24 * 14,
                '1M':  60 * 24 * 28,
            },
            counter = Math.ceil(diff / multiplies[timeframe] / this.limit), // num of requests

            data = [];

        let TS1 = new Date().getTime();


        for (let i = 1; i <= counter; i++) {
            console.log(`-> Request #${i}/${counter}, Start from`, new Date(start).toISOString().substr(0, 19));

            let res = await this.getCandlesGroup({ timeframe, pair, start, end });

            if (!res.length || res[0] === 'error')
                continue;

            data = [
                ...data,
                ...res.filter(new_candle =>
                    data.reduceRight((add, candle) => add && !candle.includes(new_candle[0]), true) // add new candle if it no includes in the data
                )
            ];

            console.log(`<- Got ${data.length} candles`);

            start = res.pop()[0] + (multiplies[timeframe] * 60 * 1000); // shift to the next group
        }

        let TS2 = new Date().getTime();

        console.log(`~~ Elapsed time: ${TS2 - TS1}ms`);

        return data;
    },


    formatCandles(data) {
        let ohlc = [], volume = [];

        data.forEach(arr => {
            ohlc.push([
                arr[0], // the date
                arr[1], // open
                arr[3], // high
                arr[4], // low
                arr[2]  // close
            ]);
            volume.push([
                arr[0], // the date
                arr[5]  // the volume
            ])
        });
        return { ohlc, volume };
    },


    /**
     * MTS      int     millisecond time stamp
     * OPEN     float   First execution during the time frame
     * CLOSE    float   Last execution during the time frame
     * HIGH     float   Highest execution during the time frame
     * LOW      float   Lowest execution during the timeframe
     * VOLUME   float   Quantity of symbol traded within the timeframe
     */
    getCandlesGroup({ timeframe, pair, start, end }) {

        return new Promise(resolve => {
            request.get(
                this.url + `/candles/trade:${timeframe}:${pair}/hist?limit=${this.limit}&start=${start}&end${end}&sort=1`,
                (error, response, body) => {
                    if (error)
                        throw error;

                    let result = JSON.parse(body);

                    // console.log(`<- Exchange candles response for ${pair}`, result);

                    resolve(result);
                }
            );

        });
    }

};