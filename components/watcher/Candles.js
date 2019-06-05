const path = require('path'),
    db = require('../../models/database');

module.exports = {

    /**
     *
     * @param request
     * @returns {Promise<{result, infinity: boolean}>}
     */
    async getMany(request) {


        const { exchange } = request,
            dir = path.resolve(__dirname, `../../models/exchange/${exchange}`),
            Exchange = require(dir);

        let callback = msg => {
            let data = JSON.parse(msg);
            console.log(data);
        };


        return {
            infinity: true,
            result:   await Exchange.getCandlesRealtime(request, callback)
        }
    }
};