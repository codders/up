import './up-types';
import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://up-now-a6da8.firebaseio.com"
});

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
export const validateFirebaseIdToken = (req: express.Request, res: express.Response, next: () => void) => {
  console.log('Check if request is authorized with Firebase ID token', req.method);
  if (req.method === 'OPTIONS') {
    next();
    return;
  }

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

export const saveSubscription = (subscription: any, uid: string) => {
  console.log('Saving subscription for user', uid)
  return admin.firestore().collection('users').doc(uid)
    .update({
      subscription: subscription
    })
    .catch(function(error) {
      console.error('Unable to save subscription record for user ' + uid, subscription);
      return "error";
    });
};

interface PushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export const loadSubscription: (arg0: string) => Promise<PushSubscription> = (uid: string) => {
  console.log('Loading subscription for user', uid)
  return admin.firestore().collection('users').doc(uid)
    .get().then(function(doc) {
      if (doc.exists) {
        const data = doc.data();
        if (data !== undefined && 'subscription' in data) {
          return data.subscription as PushSubscription;
        } else {
          console.log('No subscription recorded for user ' + uid, data);
          throw new Error('No subscription information for user ' + uid);
        }
      } else {
        console.log('User ' + uid + ' does not exist');
        throw new Error('User ' + uid + ' does not exist');
      }
    })
    .catch(function(error) {
      console.error('Unable to get subscription record for user ' + uid);
      throw new Error('Unable to load subscription data');
    });
};

export const saveUp = (record: up.UpRecord) => {
  const savedRecord = Object.assign(record, {
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
  return admin.firestore().collection('up').add(savedRecord)
    .then(function(doc) {
      return doc.id;
    })
    .catch(function(error) {
      console.error('Unable to save record', record);
      return "error";
    });
};

export const loadUp = (uid: String) => {
  const midnight = new Date();
  midnight.setHours(0,0,0,0);
  return admin.firestore().collection('up')
    .where("inviteduid", "==", uid)
    .where("timestamp", ">", midnight)
    .get()
    .then(function(querySnapshot) {
      const result: up.UpRecord[] = []
      querySnapshot.forEach(function(doc) {
        const record = doc.data() as up.UpRecord;
        result.push(record);
      });
      return result;
    })
    .catch(function(error) {
      console.log("Error fetching whats up: ", error);
      return [];
    });
};

export const nameForUser = (uid: string) => {
  return admin.firestore().collection('users')
    .doc(uid)
    .get().then(function(userDoc) {
      if (userDoc.exists) {
        const userDocData = userDoc.data()
        if (userDocData !== undefined) {
          return userDocData.name
        } else {
          throw new Error('User data doc undefined for user: ' + uid)
        }
      } else {
        throw new Error('Unable to load user doc for user: ' + uid)
      }
    })
    .catch(function(error) {
      console.log('Unable to load name record for user: ', error)
    })
}

export const loadFriends = (uid: string) => {
  console.log('Loading friends for user', uid)
  return admin.firestore().collection('users').doc(uid).collection('friends')
    .get().then(function(querySnapshot) {
      const promises: PromiseLike<void>[] = []
      const friends: up.DirectoryEntry[] = [];
      querySnapshot.forEach(function(friendDoc) {
        const record = friendDoc.data();
        promises.push(
          nameForUser(record.uid).then(function(name) {
            if (name !== undefined) {
              friends.push({
                uid: record.uid,
                name: name
              })
            }
          })
        )
      })
      return Promise.all(promises).then(function(results) {
        return friends
      })
    })
    .catch(function(error) {
      console.log("Error fetching list of friends: ", error);
      return [];
    });
};

export const loadDirectory = (uid: String) => {
  return admin.firestore().collection('users')
    .get()
    .then(function(querySnapshot) {
      const result: up.DirectoryEntry[] = [];
      querySnapshot.forEach(function(doc) {
        const record = doc.data();
        if (record.id != uid) {
          result.push({
            uid: record.id,
            name: record.name
          });
        }
      });
      return result;
    })
    .catch(function(error) {
      console.log("Error fetching directory: ", error);
      return [];
    });
};
