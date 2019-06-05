import timeframes from './timeframes'

const past = (d => new Date(d.setFullYear(d.getFullYear() - 3)))(new Date);

export default {
    _context:   "exchange",
    apiKey:     "",
    fee:        0.1,
    symbols:    {
        BTC: ["USD"]
    },
    symbol:     "BTC",
    pair:       "USD",
    deposit:    [0, 100],
    start:      past.toISOString(),
    end:        false,
    timeframe:  "1D",
    timeframes: Object.keys(timeframes)
};