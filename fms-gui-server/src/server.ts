'use strict';

import {ExpressApp} from './express-app';
import {environment} from './environments/environment';
import {interval} from 'rxjs';
import * as fs from 'fs';
import * as wsWebSocket from 'ws';
import {Logger} from './shared/services/logger/logger';

const port: number = environment.server.port;
const options = environment.server.options;
const paths = environment.server.paths;

/**
 * The timer, which tells how often a given function should be called
 */
const source = interval(options.period);

const expressApp: ExpressApp = new ExpressApp();
const app = expressApp.app;
const expressWs = expressApp.expressWs;

app.get('/', (req, res) => {
    Logger.log('New GET request');
    res.json({
        status: 200,
        message: 'Hello WebSocket world!'
    });
});

/**
 * This enables the communication over the ws protocol
 */
expressWs.app.ws(paths.subscribe, (ws: wsWebSocket, req) => {
    // on('open') is not an event!

    ws.on('message', (msg: string) => {
        Logger.log(`Received ${msg}`);
        ws.send(JSON.stringify({
            status: 200,
            message: 'Subscription submitted'
        }));
    });

    ws.on('close', () => {
        Logger.log('Close websocket');
        ws.close();
    });
});

/**
 * Sends the newest FMS data to the connected clients
 */
function updateFMSData() {
    let clients: Set<wsWebSocket> = expressWs.getWss().clients;
    // Notify clients every 'period' seconds
    clients.forEach((client: wsWebSocket) => {
        if (client.readyState === client.OPEN) {
            // Get the FMS data
            fs.readFile(__dirname + '/..' + paths.fmsData, (err, data) => {
                if (err) {
                    Logger.error(err);
                    throw err;
                }

                // Send the FMS data to the client
                client.send(data.toString('utf8'));
            });
        }
    });
}

/**
 * Creates a http server and enables REST requests
 */
app.listen(port, () => {
    Logger.log(`Server started on port ${port}`);
    // Update the user every 'period' seconds
    source.subscribe(() => updateFMSData());
});