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

export const loadDirectory = () => {
  return admin.firestore().collection('users')
    .get()
    .then(function(querySnapshot) {
      const result: up.DirectoryEntry[] = [];
      querySnapshot.forEach(function(doc) {
        const record = doc.data();
        result.push({
          uid: record.id,
          name: record.name
        });
      });
      return result;
    })
    .catch(function(error) {
      console.log("Error fetching directory: ", error);
      return [];
    });
};
