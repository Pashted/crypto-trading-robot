const db = require('../../models/database');

module.exports = {

    get: async () => await db.get(
        'settings',
        { _context: 'user' }
    ),

    set: async ({ data }) => await db.set(
        'settings',
        { _context: 'user' },
        data
    ),

    reset: async () => await db.delete('settings')
};