// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/**
 * The server's properties
 *
 * serverOptions:   Security related
 *  - key
 *  - cert
 * options:
 *  - period: The WebSocket update period
 */
export const environment = {
    production: false,
    server: {
        secure: false,
        host: 'localhost',
        port: 9000,
        paths: {
            subscribe: {
                fms: "/ws/",
                cards: "/ws/cards",
                controls: "/ws/controls",
                /*
                fms: "/subscribe/fms",
                cards: "/subscribe/cards",
                controls: "/subscribe/controls"
                 */
            },
            data: {
                fms: '/assets/json/fms-name-value-pairs.json',
                cards: '/assets/json/cards-name-value-pairs.json',
                controls: '/assets/json/status-panel.controls.json'
            }
        },
        serverOptions: {
            key: "",
            cert: ""
        },
        options: {
            period: 1000,
        }
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
