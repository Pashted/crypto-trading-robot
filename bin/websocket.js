const WebSocket = require('ws'),
    WebSocketServer = WebSocket.Server;

/**
 * Creating a WebSocket server over of http-server
 * @param server
 */
let start = server => {
    let socket = new WebSocketServer(server);


    socket.on('connection', async ws => {


        // creating a string from an object before sending
        let send = data => {
            console.log('>> RESPONSE\n', data);
            ws.send(JSON.stringify(data));
        };


        console.log('<< USER CONNECTED');

        /**
         * Processing incoming requests
         * Minimal requirements to request format = { action: "com.context.method" }
         * com - component
         * context - component's separate file
         * method - component's function
         */
        ws.on('message', async query => {

            let request = JSON.parse(query),
                response = { data: 'empty response' };

            console.log('<< INCOMING REQUEST\n', request);


            try {

                response.event = request.action;

                const [com, context, method] = request.action.split('.');

                response.data = await require(`../components/${com}/${context}`)[method](request);


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