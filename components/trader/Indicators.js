const { DC } = require('bfx-hf-indicators'),
    db = require('../../models/database');


module.exports = {
    DC: {
        /**
         *
         * @param ohlc {Array} [ Timestamp, Open, High, Low, Close ]
         * @returns {*|Array}
         */
        process(ohlc) {
            let _dc = new DC([ 20 ]), dc = [];

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