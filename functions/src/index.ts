import './express-types';
import * as functions from 'firebase-functions';
import { validateFirebaseIdToken,
         saveUp,
         loadUp,
         loadInvites,
         deleteUpRecordsByInvite,
         loadDirectory,
         loadFriends,
         lookupUserByEmail,
         loadInterestRegisterForUser,
         addFriendRecord,
         deleteFriendByUid,
         nameForUser,
         respondToUp,
         saveInviteRecordForUser,
         saveSubscription } from './firebase-wrapper';
import { findMatches,
         getUpRecordsForRequest } from './up-logic';
import { sendShowUpNotification,
         sendUpMatchNotification } from './notification';

const express = require('express')
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();

app.use(validateFirebaseIdToken);
app.use(cors);
app.use(cookieParser);
app.delete('/up/:id', (request: express.Request, response: express.Response) => {
  console.log('Deleting up record ' + request.params.id + ' at ' + request.user.email + '\'s request');
  deleteUpRecordsByInvite(request.params.id, request.user.uid).then(writeResult => {
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
  respondToUp(request.user.uid, request.params.id, request.body.isUp).then(result => {
    if (request.body.isUp) {
      return nameForUser(request.user.uid).then(name => {
        return sendUpMatchNotification(name, result);
      })
      .catch(err => {
        console.log('Unable to load name for user: ', err)
        return err;
      })
    } else {
      return Promise.resolve(result);
    }
  })
  .catch(err => {
    console.log('Unable to send up match notification', err);
    response.status(500).send({ error: err })
  })
  .then(result =>
    loadUp(request.user.uid).then(whatsUp => {
      response.status(200).send(findMatches(whatsUp));
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
app.get('/myUp', (request: express.Request, response: express.Response) => {
  console.log('Checking what ' + request.user.email + ':' + request.user.uid + ' is up for');
  loadInvites(request.user.uid).then(whatsUp => {
    response.status(200).send(whatsUp);
  })
  .catch(err => {
    console.log('Unable to work out what\'s up', err);
  });
});
app.get('/whatsUp', (request: express.Request, response: express.Response) => {
  console.log('Checking what\'s up for ' + request.user.email + ':' + request.user.uid);
  loadUp(request.user.uid).then(whatsUp => {
    response.status(200).send(findMatches(whatsUp));
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
app.post('/friends', (request: express.Request, response: express.Response) => {
  const friend = Object.assign({}, request.body);
  addFriendRecord(request.user.uid, friend.uid).then(writeResult => {
    response.status(201).send({
      uid: friend.uid,
      name: friend.name
    });
  })
  .catch(err => {
    console.log('Unable to add friend');
  });
});
app.delete('/friends/:id', (request: express.Request, response: express.Response) => {
  console.log('Deleting friend ' + request.params.id + ' for ' + request.user.uid);
  deleteFriendByUid(request.user.uid, request.params.id).then(writeResult => {
    response.status(200).send({ uid: request.params.id })
  })
  .catch(err => {
    console.log('Unable to delete friend:', err)
    response.status(500).send({ error: err })
  })
});
app.post('/saveRecord', (request: express.Request, response: express.Response) => {
  const record = Object.assign({}, request.body);
  nameForUser(request.user.uid).then(function(userName) {
    const parentUpRecord = {
      activity: record.activity,
      name: userName,
      description: record.description,
      friends: record.friends
    }
    return Promise.all([saveInviteRecordForUser(request.user.uid, parentUpRecord),
    loadInterestRegisterForUser(request.user.uid, record.friends)]).then(function(results) {
      const parentRecordId: string = results[0]
      const interestRegister: { [uid: string]: up.InterestRegister } = results[1]
      const upRecords = getUpRecordsForRequest(
        Object.assign(parentUpRecord, {
          parentId: parentRecordId,
          uid: request.user.uid
        }),
        interestRegister
      );
      console.log('Saving data: ', upRecords);
      const promises: PromiseLike<String>[] = [];
      upRecords.forEach(function(upRecord: up.UpRecord) {
        promises.push(saveUp(upRecord).then(writeResult => {
          return sendShowUpNotification(upRecord);
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

app.post('/addFriendByEmail', (request: express.Request, response: express.Response) => {
  const email = Object.assign({}, request.body).email;
  console.log('Adding friend by email: ', email);
  lookupUserByEmail(email).then(friend => {
    addFriendRecord(request.user.uid, friend.id).then(writeResults => {
      console.log('Got friend add result', writeResults);
      response.status(201).send({
        uid: friend.id,
        name: friend.name
      })
    })
    .catch(err => {
      console.log('Unable to save friend record', err)
      response.status(500).send({
        message: 'Unable to save friend record'
      })
    })
  })
  .catch(err => {
    console.log('Error adding friend', err)
    response.status(404).send({
      code: 'NOT_FOUND',
      message: 'Unable to find friend record ' + err
    })
  })
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.region('europe-west1').https.onRequest(app);
