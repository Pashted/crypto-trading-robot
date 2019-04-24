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

        params = req.body.params
                 ? JSON.parse(req.body.params)
                 : settings.user,

        exchange = require('./../model/exchange/' + params.exchange),
        filter = {
            'params.exchange': params.exchange
        };

    console.log('>> POST PARAMS', req.body.params);
    console.log('>> Exchange', exchange);

    let p, message = {};

    switch (req.body.method) {
        case 'getSymbols':
            p = exchange.get_symbols()
                .then(symbols => {
                    message = symbols;
                    return db.set('symbols', filter, symbols);
                })
                .then(() => db.set('settings', null, params));
            break;

        case 'getCandles':
            p = exchange.get_candles(params)
                .then(candles => {
                    message = candles;
                    return db.set('candles', filter, candles);
                })
                .then(() => db.set('settings', null, params));
            break;

        case 'resetSettings':
            p = db.delete('settings')
                .then(() => db.delete('candles', filter))
                .then(() => db.delete('symbols', filter));
            break;

        case 'setSettings':
            p = db.set('settings', null, params);
            break;

        default:
            p = Promise.resolve('Empty response');
    }

    p.then(() => res.send(message));


});


module.exports = router;
