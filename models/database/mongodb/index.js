const MongoClient = require('mongodb').MongoClient,
    dbName = 'bot',
    client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });


client.on('close', () => console.log('DB CONNECTION CLOSED!'));


// TODO: add update collection method for partial saving


module.exports = {

    connect: new Promise(resolve => {

        console.log('>> DB START CONNECT');

        client.connect(err => {
            if (err) throw err;

            resolve();

            console.log(">> DB CONNECTED SUCCESSFULLY");
            console.log(">> Go to http://localhost:3000");
        })
    }),

    /**
     * @description Gets data from DB collection
     * @param collectionName
     * @param filter
     * @returns {Promise}
     */
    async get(collectionName, filter) {

        await this.connect;

        return new Promise((resolve, reject) => {

                try {
                    let collection = client.db(dbName).collection(collectionName);

                    collection.find(filter || {})
                        .toArray((err, results) => {
                            if (err) reject(err);

                            // console.log(`>> GET ${collectionName} results`, results);

                            if (results === null || !results.length) {

                                resolve(null);

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
     * @description Replaces DB collection with the new one
     * @param collectionName
     * @param filter
     * @param data
     * @returns {Promise}
     */
    async set(collectionName, filter, data) {

        await this.connect;

        return new Promise(resolve => {

                let collection = client.db(dbName).collection(collectionName);

                collection.replaceOne(
                    filter || {},
                    data,
                    { upsert: true },
                    (err, result) => {

                        if (err) throw err;

                        // console.log(`>> REPLACE ${collectionName} results`, result.ops);

                        let status = err ? 'error' : 'success';

                        resolve(JSON.stringify({ status }))

                    }
                );
            }
        );
    },

    /**
     *
     * @param collectionName
     * @param filter
     * @returns {Promise}
     */
    async delete(collectionName, filter) {

        await this.connect;

        return new Promise(resolve => {

                let collection = client.db(dbName).collection(collectionName);

                collection.deleteMany(
                    filter || {},
                    (err, result) => {

                        if (err) throw err;

                        // console.log(`>> REPLACE ${collectionName} results`, result.ops);

                        let status = err ? 'error' : 'success';

                        resolve(JSON.stringify({ status }))

                    }
                );
            }
        );
    }

};
