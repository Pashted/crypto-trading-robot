const MongoClient = require('mongodb').MongoClient,
    dbName = 'crypto_trading_robot';

console.log('>> DB START CONNECT');

const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });

client.on('close', () => console.log('client CLOSED!'));


client.connect(err => {
    if (err) throw err;

    // TODO: there is an error when user starts page loading before connect promise has been resolved

    console.log(">> DB CONNECTED successfully");
});


// TODO: add update collection method for partial saving

module.exports = () => {


    return {

        /**
         * @description Gets data from DB collection
         * @param collectionName
         * @param _default
         * @returns {Promise}
         */
        get(collectionName, _default) {
            return new Promise((resolve, reject) => {

                    try {
                        let collection = client.db(dbName).collection(collectionName);

                        collection.find()
                            .toArray((err, results) => {
                                if (err) throw err;

                                // console.log(`>> GET ${collectionName} results`, results);

                                if (results === null || !results.length) {

                                    this.insert(collection, _default)
                                        .then(result => resolve(result[0]));

                                } else {
                                    resolve(results[0]);
                                }

                            });

                    } catch (err) {
                        reject(err);
                    }
                }
            );
        },


        /**
         * @description Inserts new collection into DB
         * @param collection
         * @param data
         * @returns {Promise}
         */
        insert(collection, data) {
            return new Promise(resolve =>

                collection.insertOne(data, (err, result) => {
                    if (err) throw err;

                    console.log('>> INSERT results', result.ops);

                    resolve(result.ops);
                })
            );
        },


        /**
         * @description Replaces DB collection with the new one
         * @param collectionName
         * @param data
         * @returns {Promise}
         */
        set(collectionName, data) {
            return new Promise(resolve => {

                    let collection = client.db(dbName).collection(collectionName);

                    collection.replaceOne(
                        {}, data, { upsert: true }, (err, result) => {

                            if (err) throw err;

                            console.log(`>> REPLACE ${collectionName} results`, result.ops);

                            let status = err ? 'error' : 'success';

                            resolve(JSON.stringify({ status }))

                        }
                    );
                }
            );
        },

    };
};
