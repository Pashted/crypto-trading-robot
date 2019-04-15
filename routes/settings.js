const express = require('express'),
    router = express.Router(),
    ex = require('../model/exchange'), // exchange module factory
    database = require('../model/database/mongodb')(),
    defaults = require('../model/defaults');

// TODO settings.prototype instead separate variable

router.get('/', (req, res, next) => {

    database.get('settings', defaults.settings)

        .catch(err => next(new Error(err)))

        .then(settings => database.get('symbols', {})
            .then(symbols => database.get('candles', {})
                .then(candles => {
                    candles = candles.params !== undefined ? JSON.stringify(candles, null, 4) : null;

                    console.log('>> Settings is', settings);
                    res.render('settings/index', {
                        section:   'settings',
                        title:     'Settings section',
                        tab:       (req.query.tab || 1) - 1,
                        exchanges: ex._list,
                        settings, defaults, symbols, candles,
                    })

                })
            )
        );

});

router.post('/', (req, res, next) => {

    console.log('>> INCOMING POST REQUEST:', req.body);

    let params = req.body.params ? JSON.parse(req.body.params) : defaults.settings;
    console.log('>> PARAMS', params);

    const exchange = ex[params.exchange || defaults.settings.exchanges];
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
            p = database.set('settings', params)
                .then(() => database.set('candles', {}))
                .then(() => database.set('symbols', defaults.symbols));
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
