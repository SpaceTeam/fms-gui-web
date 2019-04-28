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

const fmsClients: Array<wsWebSocket> = [];
const cardsClients: Array<wsWebSocket> = [];
const controlsClients: Array<wsWebSocket> = [];

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
expressWs.app.ws(paths.subscribe.fms, (ws: wsWebSocket) => {
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

    console.log("Push FMS");
    fmsClients.push(ws);
});

/**
 * Cards ws communication
 */
expressWs.app.ws(paths.subscribe.cards, (ws: wsWebSocket) => {
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
expressWs.app.ws(paths.subscribe.controls, (ws: wsWebSocket) => {
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

    console.log("Push Controls");
    controlsClients.push(ws);
});

/**
 * Sends the newest FMS data to the connected clients
 */
function updateFMSData(): void {
    // Notify clients every 'period' seconds
    fmsClients.forEach((client: wsWebSocket) => {
        if (client.readyState === client.OPEN) {
            // Get the FMS data from the specified directory
            readDataAndSendToClient(client, paths.data.fms);
        }
    });
}

function updateCardsData(): void {
    // Notify clients every 'period' seconds
    cardsClients.forEach((client: wsWebSocket) => {
        if (client.readyState === client.OPEN) {
            // Get the Cards data from the specified directory
            readDataAndSendToClient(client, paths.data.cards);
        }
    });
}

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
        updateFMSData();
        updateCardsData();
    });
});