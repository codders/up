import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

const withCors = function(method: String, request: any, response: any) {
  if (request.method === 'OPTIONS') {
    response.set('access-control-allow-methods', method);
    response.set('access-control-allow-headers', 'content-type');
    response.set('access-control-max-age', '3600');
    response.set('access-control-allow-origin', '*');
    response.status(204).send('');
    return false;
  } else {
    console.log("Request method: " + request.method);
    /* xxx: consider restricting this to specific hosts */
    response.set('access-control-allow-origin', '*');
    return true;
  }
}

export const helloWorld = functions.region('europe-west1').https.onRequest((request, response) => {
  if (withCors('get', request, response)) {
    response.send("hello from firebase!");
  }
});

export const saveRecord = functions.region('europe-west1').https.onRequest((request, response) => {
  if (withCors('post', request, response)) {
    console.log('Saving data: ', request.body);
    response.status(201).send('Write more code');
  }
});
