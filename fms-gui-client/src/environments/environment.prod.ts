// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  paths: {
    flags: 'status/flags1',
    timestamp: 'status/FMSTimestamp'
  },
  production: false,
  server : {
    secure: false,
    host: 'localhost',
    port: 9000,
    subscribe: {
      basePath: '/',
      fms: '',
      cards: 'cards',
      controls: 'controls'
    }
  },
  visualization: {
    radar: {
      circle: {
        radius: 4
      },
      equidistant: {
        circles: 5,
        padding: 50
      },
      position: {
        center: {
          longitude: 50,
          latitude: 15
        },
        max: {
          altitude: 100
        }
      },
      style: {
        padding: 40
      }
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
