const express = require('express'),
    router = express.Router(),
    path = require('path'),
    index = path.resolve(__dirname, '../src/html/index.html'),
    sections = [
        '/',
        '/trading/emulation/',
        '/trading/realtime/',
        '/settings/exchange/',
        '/settings/strategy/',
        '/settings/interface/',
        '/help/'
    ];

router.get(sections, (req, res) => res.sendFile(index));

// Parent sections - redirects to its first element
router.get('/trading/', (req, res) => res.redirect('/trading/emulation/'));
router.get('/settings/', (req, res) => res.redirect('/settings/exchange/'));

module.exports = router;
