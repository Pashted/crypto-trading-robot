const express = require('express'),
    router = express.Router(),
    get_settings = require('../model/settings'),
    fs = require('fs');

router.get('/', async (req, res, next) => {

        res.render('home/index', {
            title:       'Crypto Trading Robot',
            description: 'Welcome to the app',
            settings:    await get_settings()
        });

    }
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
