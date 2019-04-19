const express = require('express'),
    router = express.Router(),
    get_settings = require('../model/settings');

// TODO: change favicon to colored one on trading start

/* GET users listing. */
router.get('/', async function (req, res, next) {

    res.render('trading/index', {
        section:  'trading',
        title:    'Trading section',
        tab:      (req.query.tab || 1) - 1,
        settings: await get_settings()
    });

});

module.exports = router;
