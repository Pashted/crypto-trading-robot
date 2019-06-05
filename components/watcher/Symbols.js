const path = require('path');

module.exports = {

    get: async ({ exchange }) => {
        const dir = path.resolve(__dirname, `../../models/exchange/${exchange}`),
            Exchange = require(dir),
            symbols = await Exchange.getSymbols();

        return { symbols };
    }
};