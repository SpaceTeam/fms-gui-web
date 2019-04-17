'use strict';

import {ExpressApp} from './express-app';
import {environment} from './environments/environment';

const port: number = environment.server.port;
const expressApp: ExpressApp = new ExpressApp();

const app = expressApp.app;
const ws = expressApp.ws;

app.get('/', (req, res) => {
    console.log('New connection');
    res.json({
        status: 200,
        message: 'Hello WebSocket world!'
    });
});

/**
 * This enables the communication over the ws protocol
 */
app.ws('/' + environment.server.subscribe, (ws, req) => {

    ws.on('message', msg => {
        console.log(`Received ${msg}`);
        ws.send(JSON.stringify({
            status: 200,
            message: 'Subscription submitted'
        }));
    });

    ws.on('close', () => {
        console.log('Close websocket');
        ws.close();
    });
});

/**
 * Creates a http server and enables REST requests
 */
app.listen(port, () => console.log(`Server started on port ${port}`));