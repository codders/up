import './express-types';
import * as functions from 'firebase-functions';
import { validateFirebaseIdToken,
         saveUp,
         loadUp,
         loadDirectory,
         saveSubscription } from './firebase-wrapper';
import upLogic from './up-logic';
import { notifyUser } from './notification';

const express = require('express')
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();

app.use(validateFirebaseIdToken);
app.use(cors);
app.use(cookieParser);
app.get('/whatsUp', (request: express.Request, response: express.Response) => {
  console.log('Checking what\'s up for ' + request.user.email + ':' + request.user.uid);
  loadUp(request.user.uid).then(whatsUp => {
    response.status(200).send(upLogic.findMatches(whatsUp));
  })
  .catch(err => {
    console.log('Unable to work out what\'s up', err);
  });
});
app.get('/directory', (request: express.Request, response: express.Response) => {
  loadDirectory(request.user.uid).then(directory => {
    response.status(200).send(directory);
  })
  .catch(err => {
    console.log('Unable to fetch the directory');
  });
});
app.post('/saveRecord', (request: express.Request, response: express.Response) => {
  const record = Object.assign({}, request.body);
  const upRecords = upLogic.getUpRecordsForRequest({
    activity: record.activity,
    uid: request.user.uid,
    description: record.description,
    friends: record.friends
  });

  console.log('Saving data: ', upRecords);
  const promises: PromiseLike<String>[] = [];
  upRecords.forEach(function(upRecord: up.UpRecord) {
    promises.push(saveUp(upRecord).then(writeResult => {
      return notifyUser(upRecord);
    }));
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
app.post('/saveSubscription', (request: express.Request, response: express.Response) => {
  const subscription = Object.assign({}, request.body);
  console.log('Saving subscription: ', subscription);
  saveSubscription(subscription, request.user.uid).then(writeResults => {
    console.log('Got subscription write result', writeResults);
    response.status(201).send({
      success: true,
      message: 'Subscription updated'
    });
  })
  .catch(err => {
    console.log('Error saving subscription', err);
  })
});


// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.region('europe-west1').https.onRequest(app);
