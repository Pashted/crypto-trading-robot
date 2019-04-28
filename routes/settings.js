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

    // TODO handle errors in promises

    console.log('>> INCOMING POST REQUEST:', req.body);

    const _settings = await get_settings();
    let params;

    if (req.body.params) {
        params = JSON.parse(req.body.params);
        params.__proto__ = _settings.user;

        await db.set('settings', null, params);

    } else {
        params = _settings.user;
    }


    let exchange = require('./../model/exchange/' + params.exchange),
        filter = {
            'params.exchange': params.exchange
        };

    console.log('>> POST PARAMS', req.body.params);
    console.log('>> Exchange', exchange);

    let message = { status: "Empty response" };

    switch (req.body.method) {
        case 'importSymbols':

            let symbols = await exchange.get_symbols(); // get symbols from exchange
            message = symbols.data || null;

            await db.set('symbols', filter, symbols); // save new symbols to db

            break;

        case 'importCandles':

            let ex_candles = await exchange.get_candles(params); // get candles from exchange
            message = ex_candles.data || null;

            await db.set('candles', filter, ex_candles); // save new candles to db

            break;

        case 'getCandles':

            let db_candles = await db.get('candles', filter);

            message = db_candles.data ? db_candles : null;


            break;

        case 'saveSettings':
            // TODO: separate secondary settings parameters for each exchange

            await db.set('settings', null, params);

            break;

        case 'resetSettings':

            await Promise.all([
                db.delete('settings'),
                db.delete('candles', filter),
                db.delete('symbols', filter)
            ]);

            break;

    }

    res.send(message);


});


module.exports = router;
