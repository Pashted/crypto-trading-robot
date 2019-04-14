var express = require('express');
var router = express.Router();

// TODO: change favicon to colored one on trading start

/* GET users listing. */
router.get('/', function (req, res, next) {

    res.render('trading/index', {
        section: 'trading',
        title:   'Trading section',
        tab:     (req.query.tab || 1) - 1,
    });
});

module.exports = router;
