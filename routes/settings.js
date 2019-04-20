const express = require('express'),
    router = express.Router(),
    ex = require('../model/exchange'), // exchange module factory
    db = require('../model/database/mongodb'),
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
        filter = {
            'params.exchange': params.exchange
        };

    console.log('>> POST PARAMS', req.body.params);
    console.log('>> Exchange', exchange);

    let p;

    switch (req.body.method) {
        case 'getSymbols':
            p = exchange.get_symbols()
                .then(symbols => db.set('symbols', filter, symbols));
            break;

        case 'getCandles':
            p = exchange.get_candles(params)
                .then(candles => db.set('candles', filter, candles));
            break;

        case 'resetSettings':
            p = db.delete('settings')
                .then(() => db.delete('candles', filter))
                .then(() => db.delete('symbols', filter));
            break;

        case 'saveSettings':
            p = db.set('settings', null, params);
            break;

        default:
            p = Promise.resolve('Empty response');
    }

    p.then(status => res.send(status));


});


module.exports = router;
