const path = require('path'),
    db = require('../../models/database');

module.exports = {

    get: async request => {
        let { exchange, symbol, pair, timeframe } = request;

        let filter = {
                exchange,
                pair: symbol + pair,
                timeframe
            },
            candles = await db.get('candles', filter);

        console.log('db.get.candles', candles);

        const dir = path.resolve(__dirname, `../../models/exchange/${exchange}`),
            Exchange = require(dir);

        if (!candles) {
            candles = { data: await Exchange.getCandles(request) };

            db.set(
                'candles',
                filter,
                { ...filter, ...candles }
            );
        }


        if (candles && candles.data) {
            return Exchange.formatCandles(candles.data);


        } else {
            throw new Error("Can't get candles from anywhere");
        }
    }
};