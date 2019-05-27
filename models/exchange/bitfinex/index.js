const /*BFX = require('bitfinex-api-node'),*/
    request = require('request');


// console.log(">> BFX ", BFX);


module.exports = {
    url: "https://api-pub.bitfinex.com/v2/",

    key: "",

    getSymbols() {
        return new Promise(resolve => {
            request.get(
                this.url + '/conf/pub:list:pair:exchange',
                (error, response, body) => {
                    if (error)
                        throw error;

                    let data = {},
                        result = JSON.parse(body);

                    console.log('>> EX SYMBOLS result', result);

                    if (result.error)
                        throw result.error;

                    if (result instanceof Array)
                        result = result[0];

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
                '1M':  60 * 24 * 31,
            },
            data = {},
            counter = Math.ceil(diff / multiplies[timeframe] / 5000); // num of requests


        for (let i = 1; i <= counter; i++) {
            console.log(`-> Request #${i}/${counter}, Start from`, new Date(start).toLocaleString());

            let res = await this.getCandlesGroup({ timeframe, pair, start, end });
            res.forEach(arr => data[arr[0]] = arr);

            start = res.pop()[0] + (multiplies[timeframe] * 60 * 1000); // shift to the next group
        }

        return data;
    },


    formatCandles(data) {
        let ohlc = [], volume = [];

        Object.keys(data).forEach(ts => {
            ohlc.push([
                data[ts][0], // the date
                data[ts][1], // open
                data[ts][3], // high
                data[ts][4], // low
                data[ts][2]  // close
            ]);
            volume.push([
                data[ts][0], // the date
                data[ts][5]  // the volume
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
                this.url + `/candles/trade:${timeframe}:${pair}/hist?limit=5000&start=${start}&end${end}&sort=1`,
                (error, response, body) => {
                    if (error)
                        throw error;

                    let result = JSON.parse(body);

                    console.log(`<- Exchange candles response for ${pair}`, result);

                    // let ohlc = [],
                    //     volume = [];

                    // result.forEach(candle => {
                    //     ohlc.push([
                    //         candle[0], // the date
                    //         candle[1], // open
                    //         candle[3], // high
                    //         candle[4], // low
                    //         candle[2]  // close
                    //     ]);
                    //     volume.push([
                    //         candle[0], // the date
                    //         candle[5]  // the volume
                    //     ])
                    // });

                    resolve(result);
                }
            );

        });
    }

};