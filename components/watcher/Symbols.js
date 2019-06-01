const path = require('path');

module.exports = {

    get: async ({ exchange }) => {
        const dir = path.resolve(__dirname, `../../models/exchange/${exchange}`),
            Exchange = require(dir);

        return await Exchange.getSymbols();
    }
};