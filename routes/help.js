const express = require('express'),
    router = express.Router(),
    database = require('../model/database/mongodb')(),
    defaults = require('../model/defaults');


/* GET users listing. */
router.get('/', function (req, res, next) {

    database.get('settings', defaults.settings)

        .then(settings => {

            res.render('help/index', {
                section:     'help',
                title:       'Help',
                description: 'Documentation section',
                tab:         (req.query.tab || 1) - 1,
                settings, defaults
            });
        });
});

module.exports = router;
