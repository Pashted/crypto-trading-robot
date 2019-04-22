const BFX = require('bitfinex-api-node'),
    request = require('request');


// console.log(">> BFX ", BFX);


module.exports = {
    url: "https://api-pub.bitfinex.com/v2/",

    key: "",

    get_symbols() {
        return new Promise(resolve => {
            request.get(
                this.url + '/conf/pub:list:pair:exchange',
                (error, response, body) => {
                    if (error) throw error;

                    let data = {},
                        result = JSON.parse(body);

                    console.log('>> EX SYMBOLS result', result);

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

                    resolve({
                        params: {
                            exchange: 'bitfinex'
                        },
                        data
                    });
                }
            );
        });
    },

    /**
     * MTS      int     millisecond time stamp
     * OPEN     float   First execution during the time frame
     * CLOSE    float   Last execution during the time frame
     * HIGH     float   Highest execution during the time frame
     * LOW      float   Lowest execution during the timeframe
     * VOLUME   float   Quantity of symbol traded within the timeframe
     */
    get_candles(params) {
        return new Promise(resolve => {
            request.get(
                this.url + `/candles/trade:${params.timeframe}:t${params.selectedPair}/hist`,
                (error, response, body) => {
                    if (error) throw error;

                    let data = [],
                        result = JSON.parse(body);

                    console.log(`>> EX ${params.selectedPair} CANDLES result`, result);

                    result.forEach(candle => {
                        data.push({
                            timestamp: candle[0],
                            OPEN:      candle[1],
                            CLOSE:     candle[2],
                            HIGH:      candle[3],
                            LOW:       candle[4],
                            VOLUME:    candle[5],
                        });
                    });

                    resolve({ params, data });
                }
            );

        });
    }
};