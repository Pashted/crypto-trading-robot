let ws, promiseQueue = {};


/**
 * Connect to WebSocket
 * @returns {Promise<any>}
 */
let connect = () => {

    ws = new WebSocket(`ws://${window.location.hostname}:8081/`);
    ws.onerror = reconnect;

    return new Promise(resolve => ws.onopen = () => {

        /**
         * Cancel old requests on new connection
         */
        for (let name in promiseQueue) {
            if (!promiseQueue.hasOwnProperty(name))
                continue;

            console.log('~~ WS.CONNECT: reject old promise', name);

            off(name, name + ' operation has been rejected due to reconnection');


            // TODO: save data in the queue for recurring infinity events, to request the data again after the server restarts
        }

        ws.onclose = reconnect;

        ws.onmessage = e => {
            if (!e.data)
                return false;

            let response = JSON.parse(e.data);

            console.log('<< WS.MESSAGE:', response);

            if (response.event && promiseQueue.hasOwnProperty(response.event)) {

                // makes it possible for the client to repeatedly receive responses from the server for the same event
                if (response.infinity && promiseQueue[response.event].progress)
                    promiseQueue[response.event].progress(response.data);

                else {
                    // Calling a previously saved event on the client transferring data from the server to it
                    promiseQueue[response.event].resolve(response.data);

                    // ...finish him
                    off(response.event);

                }

            }

        };

        console.log('<< WS.CONNECT - READY');
        timer = 0;

        resolve();
    });
};


/**
 * Reconnect when disconnected from server
 */
let timer = 0,
    reconnect = () => {
        console.log(`~~ WS.RECONNECT: Connection lost. Reconnect in ${++timer} sec...`);

        setTimeout(connect, timer * 1000);
    };


/**
 * Subscription from other modules to server events
 * @param name {String}
 * @param callbacks {Object}
 */
let on = (name, callbacks) => {
    /**
     * Callbacks are saved to the array in case of reconnection to the server.
     * On the new connection they need to hang up again - this is the "connect" function's area of responsibility.
     */
    // console.log('~~ WS.ON:', name);

    if (promiseQueue.hasOwnProperty(name)) {
        callbacks.reject("Server is busy. Please wait or check server's console.");

        return false;

    } else {
        promiseQueue[name] = callbacks;

        return true;
    }
};


/**
 * Removing subscription to an event
 * @param name {String}
 * @param reason
 */
let off = (name, reason) => {

    if (promiseQueue.hasOwnProperty(name)) {
        // console.log('~~ WS.OFF:', name, reason || 'no reason');

        promiseQueue[name].reject(reason || `${name} operation has been rejected without reason`);


        delete promiseQueue[name];

    } else {
        console.log(name + ' promise not found');
    }
};


/**
 * Sending a message to the server with a response event subscription
 * @param data {Object}
 * @param onProgress {Function} Optional callback for loop response
 */
let send = (data, onProgress) => new Promise((resolve, reject) => {

    const progress = typeof onProgress === 'function' ? onProgress : null;

    if (on(data.action, { resolve, reject, progress })) {

        console.log('>> WS.SEND:', data);

        // forming a string from an object before sending
        ws.send(JSON.stringify(data));
    }

});


export { connect, on, off, send };