import * as express from 'express';
import * as expressWs from 'express-ws';
import * as cors from 'cors';

/**
 * This is an express application with the needed configuration
 */
export class ExpressApp {

    /**
     * Handles the REST calls
     */
    public app;

    /**
     * Handles the websocket stuff, notifying clients
     */
    public ws;

    constructor() {
        // Create an express app
        this.app = express();

        // Create the webserver
        this.ws = expressWs(this.app).app;

        // use cors (cross site requests)
        this.app.use(cors());
    }
}