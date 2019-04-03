import './express-types';
import * as functions from 'firebase-functions';
import { validateFirebaseIdToken, saveUp, loadUp } from './firebase-wrapper';
import upLogic from './up-logic';

const express = require('express')
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();

app.use(validateFirebaseIdToken);
app.use(cors);
app.use(cookieParser);
app.get('/helloWorld', (req: express.Request, res: express.Response) => {
  console.log('About to send response', req);
  if (req.user !== null) {
    res.status(200).send(`Hello ${req.user.name}`);
  } else {
    res.status(403).send('You need to log in');
  }
});
app.get('/whatsUp', (request: express.Request, response: express.Response) => {
  console.log('Checking what\'s up for ' + request.user.email);
  loadUp().then(whatsUp => {
    response.status(200).send(upLogic.findMatches(whatsUp));
  })
  .catch(err => {
    console.log('Unable to work out what\'s up', err);
  });
});
app.post('/saveRecord', (request: express.Request, response: express.Response) => {
  const record = Object.assign({}, request.body);
  const recordWithAuth = Object.assign(record, {
    uid: request.user.uid,
    email: request.user.email
  })
  console.log('Saving data: ', recordWithAuth);

  saveUp(recordWithAuth).then(writeResult => {
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
