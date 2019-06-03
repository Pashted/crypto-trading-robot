import timeframes from './timeframes'

const yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date);

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
    start:      yesterday.toISOString(),
    end:        false,
    timeframe:  "1D",
    timeframes: Object.keys(timeframes)
};