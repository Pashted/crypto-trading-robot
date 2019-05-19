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
                    event: request.method,
                    // infinity: request.infinity || false
                };

            console.log('<< INCOMING REQUEST:', request);


            try {
                switch (request.method) {

                    case 'getUserSettings':
                        response.data = await db.get('settings', { _context: 'user' });
                        break;

                    case 'setUserSettings':
                        response.data = await db.set('settings', { _context: 'user' }, request.data);
                        break;


                    case 'getExchangesList':
                        response.data = require('../models/exchange');
                        break;

                    case 'getExchangeSettings':
                        response.data = await db.get('settings', { _context: 'exchange', exchange: request.exchange });
                        break;

                    case 'setExchangeSettings':
                        response.data = await db.set('settings', { _context: 'exchange', exchange: request.data.exchange }, request.data);
                        break;

                    case 'resetSettings':
                        response.data = await db.delete('settings');
                        break;

                    case 'resetExchange':
                        response.data = await db.delete('settings', { _context: 'exchange', exchange: request.exchange });
                        break;

                    default:
                        response.status = 'empty response';

                }

            } catch (err) {
                response.data = err.message;
                response.status = 'error';

            }

            if (response.data && response.data._id)
                delete response.data._id;

            send(response);

        });


        ws.on('close', () => console.log('~~ USER DISCONNECTED'));
    });

};


module.exports = start;