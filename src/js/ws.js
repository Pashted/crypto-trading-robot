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
         * Adding the server response handlers to the new connection
         */
        for (let name in promiseQueue) {
            if (!promiseQueue.hasOwnProperty(name))
                continue;

            console.log('~~ WS.CONNECT: reject old promise', name);

            off(name);


            // TODO: save data in the queue for recurring infinity events, to request the data again after the server restarts
        }

        ws.onclose = reconnect;

        ws.onmessage = event => {
            if (!event.data)
                return false;

            let response = JSON.parse(event.data);

            console.log('<< WS.MESSAGE:', response);

            if (response.event && promiseQueue.hasOwnProperty(response.event)) {

                // Calling a previously saved event on the client transferring data from the server to it
                promiseQueue[response.event].resolve(response.data);

                // makes it possible for the client to repeatedly receive responses from the server for the same event
                if (response.data && !response.data.infinity)
                    off(response.event);

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

    // re-subscription
    if (promiseQueue.hasOwnProperty(name))
        off(name);


    /**
     * Callbacks are saved to the array in case of reconnection to the server.
     * On the new connection they need to hang up again - this is the "connect" function's area of responsibility.
     */
    // console.log('~~ WS.ON:', name);

    promiseQueue[name] = callbacks;
};


/**
 * Removing subscription to an event
 * @param name {String}
 * @param rejectReason
 */
let off = (name, rejectReason) => {

    if (promiseQueue.hasOwnProperty(name)) {
        // console.log('~~ WS.OFF:', name, rejectReason ? 'REJECTED' : '');

        promiseQueue[name].reject(rejectReason || 'rejected without reason');


        delete promiseQueue[name];

    } else {
        console.log(name + ' promise not found');
    }
};


/**
 * Sending a message to the server with a response event subscription
 * @param data {Object}
 */
let send = data => new Promise((resolve, reject) => {

    on(data.action, { resolve, reject });

    console.log('>> WS.SEND:', data);

    // forming a string from an object before sending
    ws.send(JSON.stringify(data));
});


export { connect, on, off, send };