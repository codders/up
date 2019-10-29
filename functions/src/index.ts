import './express-types';
import * as functions from 'firebase-functions';
import { validateFirebaseIdToken,
         saveUp,
         loadUp,
         loadMyUp,
         deleteUpRecord,
         loadDirectory,
         loadFriends,
         nameForUser,
         respondToUp,
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
app.delete('/up/:id', (request: express.Request, response: express.Response) => {
  console.log('Deleting up record ' + request.params.id + ' at ' + request.user.email + '\'s request');
  deleteUpRecord(request.params.id, request.user.uid).then(writeResult => {
    response.status(200).send({ id: request.params.id })
  })
  .catch(err => {
    console.log('Unable to delete record:', err)
    response.status(500).send({ error: err })
  })
});
app.post('/up/:id', (request: express.Request, response: express.Response) => {
  console.log('Got post body', request.body);
  console.log('Responding to what\'s up ' + request.params.id + ' for ' + request.user.email + ':' + request.user.uid);
  respondToUp(request.user.uid, request.params.id, request.body.isUp).then(result =>
    loadUp(request.user.uid).then(whatsUp => {
      response.status(200).send(upLogic.findMatches(whatsUp));
    })
    .catch(err => {
      console.log('Unable to load up records after response', err)
    })
  )
  .catch(err => {
    console.log('Unable to record response', err);
    response.status(500).send({ error: err })
  })
  });
});
app.get('/myUp', (request: express.Request, response: express.Response) => {
  console.log('Checking what ' + request.user.email + ':' + request.user.uid + ' is up for');
  loadMyUp(request.user.uid).then(whatsUp => {
    response.status(200).send(whatsUp);
  })
  .catch(err => {
    console.log('Unable to work out what\'s up', err);
  });
});
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
app.get('/friends', (request: express.Request, response: express.Response) => {
  loadFriends(request.user.uid).then(friends => {
    response.status(200).send(friends);
  })
  .catch(err => {
    console.log('Unable to fetch the list of friends');
  });
});
app.post('/saveRecord', (request: express.Request, response: express.Response) => {
  const record = Object.assign({}, request.body);
  nameForUser(request.user.uid).then(function(userName) {
    const upRecords = upLogic.getUpRecordsForRequest({
      activity: record.activity,
      name: userName,
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
      response.status(500).send({
        success: false,
        message: err
      })
    })
  })
  .catch(err => {
    console.log('Unable to load name for user: ', err)
    response.status(500).send({
      success: false,
      message: err
    })
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
