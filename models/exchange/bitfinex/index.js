const /*BFX = require('bitfinex-api-node'),*/
    request = require('request'),
    WebSocket = require('ws');

// console.log(">> BFX ", BFX);


module.exports = {
    url: "https://api-pub.bitfinex.com/v2/",
    ws:  "wss://api-pub.bitfinex.com/ws/2",

    rate:  45 / 60, // max number of queries per minute
    limit: 5000, // query results length limit

    getSymbols() {
        return new Promise((resolve, reject) => {

            console.log('-> Request Exchange symbols list...');

            request.get(
                this.url + '/conf/pub:list:pair:exchange',
                (error, response, body) => {
                    if (error)
                        reject(error);

                    let result = JSON.parse(body),
                        data = {};

                    if (result.error)
                        reject(result.error);

                    if (result instanceof Array)
                        result = result[0];

                    console.log(`<- Exchange symbols response ${result.length} items`, result);

                    result.forEach(symbol => {

                        let cur = symbol.substr(0, 3), // first currency in pair
                            pair = symbol.substr(3); // second currency in pair

                        if (!data[cur]) // if found currency 1st time
                            data[cur] = [ pair ];

                        else if (!data[cur].includes(pair)) // if found pair 1st time
                            data[cur].push(pair);
                    });

                    resolve(data);
                }
            );
        })
    },


    getCandles({ timeframe, ticker, start, end }) {
        return new Promise((resolve, reject) => {

            console.log(`-> Request candles, Start from`, new Date(start).toISOString(), 'End:', new Date(end).toISOString());

            request.get(
                this.url + `/candles/trade:${timeframe}:t${ticker}/hist?limit=${this.limit}&start=${start}&end=${end}&sort=1`,
                (error, response, body) => {
                    if (error)
                        reject(error);

                    let result = JSON.parse(body);

                    if (result[0] === 'error') {
                        console.log('<-', result.pop());
                        resolve([]);

                    } else {

                        console.log(`<- Exchange responded. Candles length: ${result.length}`);
                        // if (result.length)
                        //     console.log(...result.map(arr => arr[0]));
                        // console.log(...result.map(arr => new Date(arr[0]).toISOString()));

                        resolve(result);

                    }
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
    formatCandles(candles, shift) {

        let ohlc = [], volume = [],

            keys = Object.keys(candles),
            [ ts ] = keys,
            [ stop ] = keys.slice(-1);

        while (ts <= stop) {

            const [ date, open, close, high, low, vol ] = candles[ts];

            if (candles.hasOwnProperty(ts)) {
                ohlc.push([ date, open, high, low, close ]);
                volume.push([ date, vol ]);

            } else {
                // if no data performed for this period, get the previous value
                const [ prev ] = ohlc.slice(-1)[0].slice(-1);

                ohlc.push([ date, prev, prev, prev, prev ]);
                volume.push([ date, 0 ]);
            }

            ts += shift;
        }

        return { ohlc, volume };
    },


    formatMonthCandles(candles) {

        let ohlc = [], volume = [];

        for (const ts in candles) {
            if (!candles.hasOwnProperty(ts))
                continue;

            const [ date, open, close, high, low, vol ] = candles[ts];

            ohlc.push([ date, open, high, low, close ]);
            volume.push([ date, vol ]);
        }

        return { ohlc, volume };
    },


    getCandlesRealtime({ symbol, pair, timeframe }, callback) {

        return new Promise((resolve, reject) => {
            const ws = new WebSocket(this.ws);

            ws.on('message', callback);

            let msg = JSON.stringify({
                event:   'subscribe',
                channel: 'candles',
                key:     `trade:${timeframe}:t${symbol + pair}`
            });

            ws.on('open', () => {
                ws.send(msg);
                resolve('BITFINEX WS CONNECTION OPENED');
            });

            ws.on('close', () => reject('BITFINEX WS CONNECTION CLOSED'))
        })

    }

};