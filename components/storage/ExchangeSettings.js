const db = require('../../models/database');

module.exports = {

    get: async ({ exchange }) => await db.get(
        'settings',
        { _context: 'exchange', exchange }
    ),

    set: async ({ data }) => await db.set(
        'settings',
        { _context: 'exchange', exchange: data.exchange },
        data
    ),

    reset: async ({ exchange }) => ({
        settings: await db.delete('settings', { _context: 'exchange', exchange }),
        candles:  await db.delete('candles', { exchange })
    })
};