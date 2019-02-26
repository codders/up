import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.region('europe-west1').https.onRequest((request, response) => {
  if (request.method === 'OPTIONS') {
    response.set('Access-Control-Allow-Methods', 'GET');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Max-Age', '3600');
    response.status(204).send('');
  } else {
    /* XXX: Consider restricting this to specific hosts */
    response.set('Access-Control-Allow-Origin', '*');
    response.send("Hello from Firebase!");
  }
});
