export const

    // groupingUnits
    units = [
        [ 'minute', [ 1, 5, 15, 30 ] ],
        [ 'hour', [ 1, 3, 6, 12 ] ],
        [ 'day', [ 1 ] ],
        [ 'week', [ 1, 2 ] ],
        [ 'month', [ 1 ] ]
    ],

    // preselect zoom values for each timeframe
    cases = {
        "1m":  10,
        "5m":  9,
        "15m": 8,
        "30m": 7,
        "1h":  6,
        "3h":  5,
        "6h":  4,
        "12h": 4,
        "1D":  3,
        "7D":  1,
        "14D": 0,
        "1M":  0,
    },

    buttons = [
        { type: 'all', text: 'All' },
        { type: 'year', count: 3, text: '3Y' },
        { type: 'year', count: 1, text: '1Y' },
        { type: 'month', count: 3, text: '3M' },
        { type: 'month', count: 1, text: '1M' },
        { type: 'day', count: 14, text: '14D' },
        { type: 'day', count: 7, text: '7D' },
        { type: 'day', count: 3, text: '3D' },
        { type: 'day', count: 1, text: '1D' },
        { type: 'hour', count: 6, text: '6h' },
        { type: 'hour', count: 3, text: '3h' },
        { type: 'hour', count: 1, text: '1h' }
    ];