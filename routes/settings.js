const express = require('express'),
    router = express.Router(),
    exchanges = require('../model/exchange'), // list of available exchange models
    db = require('../model/database/mongodb'),
    get_settings = require('../model/settings');


// TODO settings.prototype instead separate variable

router.get('/', async (req, res, next) => {

    res.render('settings/index', {
        section:  'settings',
        title:    'Settings section',
        tab:      (req.query.tab || 1) - 1,
        settings: await get_settings(),
        exchanges
    });

});

router.post('/', async (req, res, next) => {

    console.log('>> INCOMING POST REQUEST:', req.body);

    const settings = await get_settings(),
        params = req.body.params ? JSON.parse(req.body.params) : settings.user.__proto__,
        exchange = require('./../model/exchange/' + params.exchange);

    console.log('>> POST PARAMS', req.body.params);
    console.log('>> Exchange', exchange);

    let p;

    switch (req.body.method) {
        case 'getSymbols':
            p = exchange.get_symbols()
                .then(symbols => db.set('symbols', symbols));
            break;

        case 'getCandles':
            p = exchange.get_candles(params)
                .then(candles => db.set('candles', candles));
            break;

        case 'resetSettings':
            p = db.set('settings', {})
                .then(() => db.set('candles', {}))
                .then(() => db.set('symbols', {}));
            break;

        case 'saveSettings':
            p = db.set('settings', params);
            break;

        default:
            p = Promise.resolve('Empty response');
    }

    p.then(status => res.send(status));


});


module.exports = router;
