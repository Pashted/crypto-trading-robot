const { DC } = require('bfx-hf-indicators');


module.exports = {
    DC: {
        /**
         *
         * @param ohlc {Array} [ Timestamp, Open, High, Low, Close ]
         * @param period {Number}
         * @returns {Array}
         */
        process({ ohlc, period }) {
            let _dc = new DC([ period ]), dc = [];

            ohlc.forEach(candle => {
                const value = _dc.add({
                    high: candle[2],
                    low:  candle[3]
                });
                if (value)
                    dc.push([
                        candle[0],
                        value.upper,
                        value.lower
                    ]);
            });

            return dc;
        }
    },


    Fib: {
        calc({ B, diff, level }) {

            const dist = Math.round(diff * Math.pow(10, 4)) / 10000;
            return Math.round((B + level * dist) * Math.pow(10, 4)) / 10000;
        },

        process(dc) {

            return dc.map(([ ts, high, low ]) => [
                ts,
                this.calc({ B: low, diff: high - low, level: 3.618 }),
                this.calc({ B: low, diff: high - low, level: 2.618 }),
                this.calc({ B: low, diff: high - low, level: 1.618 }),
                this.calc({ B: high, diff: high - low, level: -1.618 }),
                this.calc({ B: high, diff: high - low, level: -2.618 }),
                this.calc({ B: high, diff: high - low, level: -3.618 }),
            ]);
        }
    }
};