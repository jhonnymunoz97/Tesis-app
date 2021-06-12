// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebaseConfig: {
    apiKey: "AIzaSyCpClIhs6vPaXv-rpemGoIq--fxllbYteI",
    authDomain: "urban-recolector.firebaseapp.com",
    projectId: "urban-recolector",
    storageBucket: "urban-recolector.appspot.com",
    messagingSenderId: "1161834233",
    appId: "1:1161834233:web:05d4c0a839d9992a88bc28",
    measurementId: "G-FEQ09MLQJH",
  },

  /* firebaseConfig: {
    apiKey: "AIzaSyBcGSPOdroEgH-HISTinEyzfN0pjKrcEWU",
    authDomain: "recolector-6334b.firebaseapp.com",
    databaseURL: "https://recolector-6334b-default-rtdb.firebaseio.com",
    projectId: "recolector-6334b",
    storageBucket: "recolector-6334b.appspot.com",
    messagingSenderId: "344277953758",
    appId: "1:344277953758:web:8db5f9e08621120ff2664f",
    measurementId: "G-8F1LL03FMV"
  }, */

  //apiURL: "http://localhost/PROYECTO/backend/api/public/",

  apiURL: "http://127.0.0.1:8000/",
  production: false,
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
