module.exports = {
    get_symbols() {
        return new Promise(resolve => {

            resolve({
                params: {
                    exchange: 'binance_demo'
                },
                data:   {
                    "BTC": ["EUR", "USD"],
                    "ETH": ["USD"]
                }
            });

        })
    }
};