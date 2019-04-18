const express = require('express'),
    router = express.Router(),
    get_settings = require('../model/settings');


/* GET users listing. */
router.get('/', async function (req, res, next) {

    res.render('help/index', {
        section:     'help',
        title:       'Help',
        description: 'Documentation section',
        tab:         (req.query.tab || 1) - 1,
        settings:    await get_settings()
    });

});

module.exports = router;
