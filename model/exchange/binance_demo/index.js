module.exports = {
    get_symbols() {
        return new Promise(resolve => {

            resolve({
                "BTC": ["EUR", "USD"],
                "ETH": ["USD"]
            });

        })
    }
};