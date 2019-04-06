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
app.get('/whatsUp', (request: express.Request, response: express.Response) => {
  console.log('Checking what\'s up for ' + request.user.email);
  loadUp(request.user.email).then(whatsUp => {
    response.status(200).send(upLogic.findMatches(whatsUp));
  })
  .catch(err => {
    console.log('Unable to work out what\'s up', err);
  });
});
app.post('/saveRecord', (request: express.Request, response: express.Response) => {
  const record = Object.assign({}, request.body);
  const upRecords = upLogic.getUpRecordsForRequest({
    activity: record.activity,
    email: request.user.email,
    uid: request.user.uid,
    description: record.description,
    friends: record.friends
  });

  console.log('Saving data: ', upRecords);
  const promises: PromiseLike<String>[] = [];
  upRecords.forEach(function(upRecord: up.UpRecord) {
    promises.push(saveUp(upRecord))
  });
  Promise.all(promises).then(writeResults => {
    console.log('Got write results', writeResults);
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
