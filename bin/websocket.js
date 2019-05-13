const WebSocket = require('ws'),
    WebSocketServer = WebSocket.Server,
    db = require('../models/database/mongodb');


/**
 * Создание websocket-сервера поверх http-сервера
 * @param server
 */
let start = server => {
    let socket = new WebSocketServer(server);


    socket.on('connection', async ws => {


        // создание строки из объекта перед отправкой
        let send = data => {
            console.log('>> RESPONSE', data);
            ws.send(JSON.stringify(data))
        };


        console.log('<< USER CONNECTED');


        /**
         * Обработка входящих запросов
         */
        ws.on('message', async query => {

            let request = JSON.parse(query),
                response = {
                    event:    request.method,
                    // infinity: request.infinity || false
                };

            console.log('<< INCOMING REQUEST:', request);


            try {
                switch (request.method) {

                    case 'getSettings':
                        response.data = await db.get('settings');
                        break;

                    case 'getExchangesList':
                        response.data = require('../models/exchange');
                        break;


                    default:
                        response.status = 'empty response';

                }

            } catch (err) {
                response.data = err.message;
                response.status = 'error';

            }


            send(response);

        });


        ws.on('close', () => console.log('~~ USER DISCONNECTED'));
    });

};


module.exports = start;