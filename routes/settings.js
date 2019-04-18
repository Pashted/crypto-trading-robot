const express = require('express'),
    router = express.Router(),
    ex = require('../model/exchange'), // exchange module factory
    database = require('../model/database/mongodb'),
    get_settings = require('../model/settings');


// TODO settings.prototype instead separate variable

router.get('/', async (req, res, next) => {

    res.render('settings/index', {
        section:   'settings',
        title:     'Settings section',
        tab:       (req.query.tab || 1) - 1,
        exchanges: ex._list,
        settings:  await get_settings()
    });

});

router.post('/', async (req, res, next) => {

    console.log('>> INCOMING POST REQUEST:', req.body);

    const settings = await get_settings(),
        params = req.body.params ? JSON.parse(req.body.params) : settings.user.__proto__,
        exchange = ex[params.exchange];

    console.log('>> POST PARAMS', req.body.params);
    console.log('>> Exchange', exchange);

    let p;

    switch (req.body.method) {
        case 'getSymbols':
            p = exchange.get_symbols()
                .then(symbols => database.set('symbols', symbols));
            break;

        case 'getCandles':
            p = exchange.get_candles(params)
                .then(candles => database.set('candles', candles));
            break;

        case 'resetSettings':
            p = database.set('settings', {})
                .then(() => database.set('candles', {}))
                .then(() => database.set('symbols', {}));
            break;

        case 'saveSettings':
            p = database.set('settings', params);
            break;

        default:
            p = Promise.resolve('Empty response');
    }

    p.then(status => res.send(status));


});


module.exports = router;
