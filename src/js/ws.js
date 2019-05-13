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

            // TODO: добавить хранение data в очереди для повторяющихся infinity событий, чтобы после перезапуска сервера запросить данные снова
        }

        ws.onclose = reconnect;

        ws.onmessage = event => {
            if (!event.data)
                return false;

            let response = JSON.parse(event.data);

            console.log('<< WS.MESSAGE:', response);

            if (response.event && promiseQueue.hasOwnProperty(response.event)) {

                console.log('<< WS.PROMISE.RESOLVE:', response.event);

                // Вызов на клиенте сохраненного ранее события с передачей ему данных с сервера
                promiseQueue[response.event].resolve(response.data);

                if (!response.infinity)
                    off(response.event);

            }

        };


        console.log('<< WS.CONNECT - READY');

        resolve();
    });
};


/**
 * Переподключение при отключении от сервера
 */
let reconnect = () => {
    console.log('~~ WS.RECONNECT: Connection lost. Reconnect in 1 sec...');

    setTimeout(connect, 1000);
};


/**
 * Подписка из других модулей на события сервера
 * @param name {String}
 * @param callbacks {Object}
 */
let on = (name, callbacks) => {

    // переподписка на событие
    if (promiseQueue.hasOwnProperty(name))
        off(name);


    /**
     * Колбеки сохраняются в массив на случай переподключения к серверу.
     * На новое соединение их нужно вешать заново - этим занимается функция connect.
     */
    console.log('~~ WS.ON:', name);

    promiseQueue[name] = callbacks;
};


/**
 * Снятие подписки на событие
 * @param name {String}
 * @param rejectReason
 */
let off = (name, rejectReason) => {

    if (promiseQueue.hasOwnProperty(name)) {
        console.log('~~ WS.OFF:', name);

        promiseQueue[name].reject(rejectReason || false);


        delete promiseQueue[name];

    } else {
        console.log(name + ' promise not found');
    }
};


/**
 * Отправка сообщения на сервер с подпиской на событие ответа
 * @param data {Object}
 */
let send = data => new Promise((resolve, reject) => {

    on(data.method, { resolve, reject });

    console.log('>> WS.SEND:', data);

    // формирование строки из объекта перед отправкой
    ws.send(JSON.stringify(data));
});


export { connect, on, off, send };