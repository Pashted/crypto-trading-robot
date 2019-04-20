const db = require('../model/database/mongodb'),
    defaults = require('../model/default-settings');

module.exports = async function () {

    /**
     * Get user settings from db
     */
    let settings = {
        user:       await db.get('settings'),
        timeframes: defaults.timeframes,
        themes:     defaults.themes
    };

    settings.user.__proto__ = defaults.user;


    /**
     * Set filter for exchange data getter
     */
    let filter = {
        'params.exchange': settings.user.exchange
    };


    /**
     * Get exchange symbols from db
     */
    let symbols = await db.get('symbols', filter);

    settings.symbols = Object.keys(symbols).length
                       ? symbols.data
                       : defaults.symbols;


    /**
     * Get exchange candles from db
     */
    let candles = await db.get('candles', filter);

    settings.candles = JSON.stringify(candles.data, null, 4);


    // console.log('>> USER SETTINGS', settings);

    return settings;
};