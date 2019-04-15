const express = require('express'),
    router = express.Router(),
    database = require('../model/database/mongodb')(),
    defaults = require('../model/defaults');


// TODO: change favicon to colored one on trading start

/* GET users listing. */
router.get('/', function (req, res, next) {

    database.get('settings', defaults.settings)

        .then(settings => {

            res.render('trading/index', {
                section: 'trading',
                title:   'Trading section',
                tab:     (req.query.tab || 1) - 1,
                settings, defaults
            });
        });
});

module.exports = router;
