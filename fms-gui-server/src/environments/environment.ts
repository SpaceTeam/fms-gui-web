// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/**
 * serverOptions:   Security related
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
            subscribe: '/subscribe',
            listFMS: '/listFMS',
            fmsData: '/assets/json/mock.fms.json'
            //fmsData: '/assets/json/fms-name-value-pairs.json'
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
