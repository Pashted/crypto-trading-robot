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
    }
};