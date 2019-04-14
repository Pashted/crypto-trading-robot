var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('help/index', {
        section:     'help',
        title:       'Help',
        description: 'Documentation section',
        tab:         (req.query.tab || 1) - 1
    });
});

module.exports = router;
