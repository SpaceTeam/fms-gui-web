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
    public app: express.Application;

    /**
     * The app that express-ws was set up on
     * Handles the websocket stuff, notifying clients
     */
    public expressWs;

    constructor() {
        // Create an express app
        this.app = express();

        // Create the web server
        this.expressWs = expressWs(this.app);

        // use cors (cross site requests)
        this.app.use(cors());
    }
}
