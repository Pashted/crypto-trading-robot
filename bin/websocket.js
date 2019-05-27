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
            ws.send(JSON.stringify(data));
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
                },
                Exchange;

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


                    // case 'setExchangeCandles':
                    //
                    //     response.data = await db.set('candles',
                    //         {
                    //             exchange: request.data.exchange,
                    //             pair:     request.data.pair
                    //         },
                    //         {
                    //             pair:     request.data.pair,
                    //             exchange: request.data.exchange,
                    //             candles:  request.data.candles,
                    //         }
                    //     );
                    //
                    //     console.log(request.data.exchange + ' CANDLES SAVE RESULT', response.data);
                    //
                    //     break;


                    case 'resetSettings':
                        response.data = await db.delete('settings');
                        break;

                    case 'resetExchange':
                        response.data = {
                            'settings': await db.delete('settings', { _context: 'exchange', exchange: request.exchange }),
                            'candles':  await db.delete('candles', { exchange: request.exchange })
                        };
                        break;

                    case 'getSymbols':
                        Exchange = require(`../models/exchange/${request.exchange}`);

                        response.data = await Exchange.getSymbols();
                        console.log(response.data);
                        break;

                    case 'getCandles':
                        let { exchange, symbol, pair, timeframe } = request;
                        pair = symbol + pair;

                        Exchange = require(`../models/exchange/${exchange}`);

                        let candles = await db.get('candles', { exchange, pair, timeframe });

                        console.log('db.get.candles', candles);

                        if (candles) {
                            candles = candles.data;

                        } else {
                            candles = await Exchange.getCandles(request);

                            db.set(
                                'candles',
                                { exchange, pair, timeframe },
                                { exchange, pair, timeframe, data: candles }
                            );
                        }

                        if (candles) {
                            response.data = Exchange.formatCandles(candles);


                        } else {
                            response.status = 'error';
                            response.data = "Can't get candles from anywhere";
                        }

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