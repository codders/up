import './express-types';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const express = require('express')
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = (req: express.Request, res: express.Response, next: () => void) => {
  console.log('Check if request is authorized with Firebase ID token');

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !(req.cookies && req.cookies.__session)) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Firebase ID Token>',
        'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if(req.cookies) {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send('Unauthorized');
    return;
  }

  admin.auth()
    .verifyIdToken(idToken)
    .then(decodedIdToken => {
      console.log('ID Token correctly decoded', decodedIdToken);
      req.user = decodedIdToken;
      console.log('Set user property of req');
      next();
    })
    .catch(error => {
      console.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('Unauthorized');
    });
};

app.use(validateFirebaseIdToken);
app.use(cors);
app.use(cookieParser);
app.get('/helloWorld', (req: express.Request, res: express.Response) => {
  console.log('About to send response', req);
  if (req.user != null) {
    res.status(200).send(`Hello ${req.user.name}`);
  } else {
    res.status(403).send('You need to log in');
  }
});
app.post('/saveRecord', (request: express.Request, response: express.Response) => {
  const record = Object.assign({}, request.body);
  const recordWithAuth = Object.assign(record, {
    uid: request.user.uid,
    email: request.user.email
  })
  console.log('Saving data: ', recordWithAuth);

  admin.firestore().collection('up').add(recordWithAuth).then(writeResult => {
    console.log('Got write result', writeResult);
    response.status(201).send({
      success: true,
      message: 'You are up!'
    });
  })
  .catch(err => {
    console.log('Error writing record', err);
  })
});


// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.region('europe-west1').https.onRequest(app);
