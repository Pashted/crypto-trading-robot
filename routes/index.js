const express = require('express'),
    router = express.Router(),
    path = require('path'),
    sections = [
        '/',
        '/trading/emulation/',
        '/trading/realtime/',
        '/settings/exchange/',
        '/settings/strategy/',
        '/settings/interface/',
        '/help/'
    ],
    db = require('../models/database/mongodb'),
    defaultTheme = require('../controllers/storage/appParams').theme;


router.get(sections, async (req, res) => {
    const settings = await db.get('settings', { _context: 'user' }),
        theme = settings ? settings.theme : defaultTheme;

    res.sendFile(path.resolve(__dirname, `../src/html/${theme}.html`));
});

// Parent sections - redirects to its first element
router.get('/trading/', (req, res) => res.redirect('/trading/emulation/'));
router.get('/settings/', (req, res) => res.redirect('/settings/exchange/'));

module.exports = router;
