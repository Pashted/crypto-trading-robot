const db = require('../../models/database');

module.exports = {

    get: async () => {
        const settings = await db.get('settings', { _context: 'user' }),
            _exchanges = require('../../models/exchange');

        return { ...settings, _exchanges }

    },

    set: async ({ data }) => await db.set(
        'settings',
        { _context: 'user' },
        data
    ),

    reset: async () => await db.delete('settings')
};