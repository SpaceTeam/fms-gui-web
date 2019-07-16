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

/**
 * A dynamic array with all subscribed FMS clients (who will receive the FMS data)
 */
const fmsClients: Array<wsWebSocket> = [];

/**
 * A dynamic array with all subscribed Cards clients (who will receive the Cards data)
 */
const cardsClients: Array<wsWebSocket> = [];

/**
 * A dynamic array with all subscribed Controls clients (who will receive the Controls data)
 */
const controlsClients: Array<wsWebSocket> = [];

/**
 * Simple GET endpoint, for testing purposes
 */
app.get('/', (req, res) => {
    Logger.log('New GET request');
    res.json({
        status: 200,
        message: 'Hello WebSocket world!'
    });
});

/**
 * FMS ws communication
 */
expressWs.app.ws(paths.subscribe.basePath + paths.subscribe.fms, (ws: wsWebSocket) => {
    // on('open') is not an event!

    ws.on('message', (msg: string) => {
        Logger.log(`Received ${msg} in FMS`);
        ws.send(JSON.stringify({
            status: 200,
            message: 'Subscription submitted'
        }));
    });

    ws.on('close', () => {
        Logger.log('Close FMS websocket');
        ws.close();
    });

    fmsClients.push(ws);
});

/**
 * Cards ws communication
 */
expressWs.app.ws(paths.subscribe.basePath + paths.subscribe.cards, (ws: wsWebSocket) => {
    // on('open') is not an event!

    ws.on('message', (msg: string) => {
        Logger.log(`Received ${msg} in Cards`);
        ws.send(JSON.stringify({
            status: 200,
            message: 'Subscription submitted'
        }));
    });

    ws.on('close', () => {
        Logger.log('Close Cards websocket');
        ws.close();
    });

    cardsClients.push(ws);
});

/**
 * Controls ws communication
 */
expressWs.app.ws(paths.subscribe.basePath + paths.subscribe.controls, (ws: wsWebSocket) => {
    // on('open') is not an event!

    ws.on('message', (msg: string) => {
        Logger.log(`Received ${msg} in Controls`);
        ws.send(JSON.stringify({
            status: 200,
            message: 'Subscription submitted'
        }));
    });

    ws.on('close', () => {
        Logger.log('Close Controls websocket');
        ws.close();
    });

    controlsClients.push(ws);
});

expressWs.getWss().on('connection', function () {
   Logger.log('Connection open');
});

/**
 * Sends the newest FMS data to the connected clients
 */
function sendFMSData(): void {
    // Notify clients every 'period' seconds
    fmsClients.forEach((client: wsWebSocket) => {
        if (client.readyState === client.OPEN) {
            // Get the FMS data from the specified directory
            readDataAndSendToClient(client, paths.data.fms);
        }
    });
}

/**
 * Send the cards data to the clients
 */
function sendCardsData(): void {
    // Notify clients every 'period' seconds
    cardsClients.forEach((client: wsWebSocket) => {
        if (client.readyState === client.OPEN) {
            // Get the Cards data from the specified directory
            readDataAndSendToClient(client, paths.data.cards);
        }
    });
}

/**
 * Send the controls data to the clients
 */
function sendControlsData(): void {
    // Notify clients every 'period' seconds
    controlsClients.forEach((client: wsWebSocket) => {
       if (client.readyState === client.OPEN) {
           // Get the Controls data from the specified directory
           readDataAndSendToClient(client, paths.data.controls);
       }
    });
}

/**
 * Reads the data from the given path and sends it to the client
 * @param client the recipient
 * @param path the path to the file from the top directory, e.g. /assets/json/status-panel.controls.json
 */
function readDataAndSendToClient(client: wsWebSocket, path: string) {
    fs.readFile(__dirname + '/..' + path, (err, data) => {
        if (err) {
            Logger.error(err);
            throw err;
        }

        // Send the data to the client
        client.send(data.toString('utf8'));
    });
}

/**
 * Creates a http server and enables REST requests
 */
app.listen(port, () => {
    Logger.log(`Server started on port ${port}`);
    // Update the user every 'period' seconds
    source.subscribe(() => {
        sendFMSData();
        sendCardsData();
        sendControlsData();
    });
});
