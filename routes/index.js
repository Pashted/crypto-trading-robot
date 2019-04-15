const express = require('express'),
    router = express.Router(),
    database = require('../model/database/mongodb')(),
    defaults = require('../model/defaults'),

    fs = require('fs');


router.get('/', (req, res, next) =>

    database.get('settings', defaults.settings)

        .then(settings => {

            res.render('index', {
                title:       'Crypto Trading Robot',
                description: 'Welcome to the app',
                settings, defaults
            })
        })
);

router.get('/jquery.js', (req, res, next) =>
    fs.readFile("./node_modules/jquery/dist/jquery.js", 'utf8', (err, data) => {
        if (err) throw err;
        res.end(data);
    })
);

router.get('/uikit.js', (req, res, next) =>
    fs.readFile("./node_modules/uikit/dist/js/uikit.js", 'utf8', (err, data) => {
        if (err) throw err;
        res.end(data);
    })
);

router.get('/uikit-icons.js', (req, res, next) =>
    fs.readFile("./node_modules/uikit/dist/js/uikit-icons.js", 'utf8', (err, data) => {
        if (err) throw err;
        res.end(data);
    })
);

router.get('/chosen.js', (req, res, next) =>
    fs.readFile("./node_modules/chosenjs/chosen.jquery.js", 'utf8', (err, data) => {
        if (err) throw err;
        res.end(data);
    })
);
router.get('/stylesheets/chosen-sprite.png', (req, res, next) => {
        let img = fs.readFileSync('./node_modules/chosenjs/chosen-sprite.png');
        res.writeHead(200, { 'Content-Type': 'image/gif' });
        res.end(img, 'binary');
    }
);
router.get('/stylesheets/chosen-sprite@2x.png', (req, res, next) => {
        let img = fs.readFileSync('./node_modules/chosenjs/chosen-sprite@2x.png');
        res.writeHead(200, { 'Content-Type': 'image/gif' });
        res.end(img, 'binary');
    }
);

module.exports = router;
