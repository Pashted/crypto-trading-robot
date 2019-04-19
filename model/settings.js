const db = require('../model/database/mongodb'),
    defaults = require('../model/default-settings');

module.exports = async function () {

    let settings = {
        user:       await db.get('settings'),
        symbols:    await db.get('symbols'),
        candles:    await db.get('candles'),
        timeframes: defaults.timeframes,
        themes:     defaults.themes
    };

    settings.user.__proto__ = defaults.user;

    if (settings.symbols._id)
        delete settings.symbols._id;

    if (!Object.keys(settings.symbols).length)
        settings.symbols = defaults.symbols;


    if (settings.candles._id)
        delete settings.candles._id;

    settings.candles = JSON.stringify(settings.candles, null, 4);

    console.log('>> USER SETTINGS', settings);


    return settings;
};