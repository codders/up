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
      console.error('Unable to save up record', record);
      return "error";
    });
};

export const saveInviteRecordForUser = (userId: string, record: up.UpRequest) => {
  const savedRecord = Object.assign(record, {
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
  return admin.firestore().collection('users').doc(userId).collection('invites').add(savedRecord)
    .then(function(doc) {
      return doc.id;
    })
    .catch(function(error) {
      console.error('Unable to save invite record', record);
      return "error";
    });
};

export const deleteUpRecordsByInvite = (recordId: string, requesterId: string) => {
  /* TODO: There is no reason here to wait for the first query to complete
   * before executing the second. This should be two Promise.alls
   */
  return admin.firestore().collection('up')
    .where("parentId", "==", recordId)
    .get()
    .then(function(querySnapshot) {
      const upPromises: PromiseLike<admin.firestore.WriteResult>[] = []
      querySnapshot.forEach(function(doc) {
        upPromises.push(doc.ref.delete())
      })
      return upPromises
    })
    .then(function (upPromises) {
      return admin.firestore().collection('users').doc(requesterId)
        .collection('invites').doc(recordId).get()
        .then(function(docSnapshot) {
          if (docSnapshot.exists) {
            return upPromises.concat([docSnapshot.ref.delete()])
          } else {
            throw new Error('Document ' + recordId + ' does not exist')
          }
        })
      })
    .then(function (allPromises) {
      return Promise.all(allPromises)
    })
}

const restrictToCurrentRecords = (query: admin.firestore.CollectionReference) => {
  const dawn = new Date();
  dawn.setHours(4,0,0,0);
  return query.where("timestamp", ">", dawn)
}

export const nameForUser = (uid: string): Promise<string> => {
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

export const lookupUserByEmail = (email: string): Promise<up.UserRecord> => {
  return admin.firestore().collection('users')
    .where("email", "==", email)
    .get()
    .then(function(querySnapshot) {
      if (querySnapshot.size !== 1) {
        throw new Error('No such friend')
      } else {
        let result = null;
        querySnapshot.forEach(function(doc) {
          result = doc.data() as up.UserRecord;
        })
        if (result === null) {
          throw new Error('Logic error finding friend')
        } else {
          console.log('Lookup result', result)
          return result;
        }
      }
    })
}

export const addFriendRecord = (uid: string, frienduid: string) => {
  const friendRecord = {
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    created_by: uid,
    id: frienduid,
    uid: frienduid
  }
  return admin.firestore().collection('users').doc(uid).collection('friends').doc(frienduid).set(friendRecord)
}

export const setSubscriptionStatusForFriend = (uid: string, friendUid: string, activityUpdate: { [id: string]: string }) => {
  const subscriptionsUpdate = Object.keys(activityUpdate).reduce(function(result, key) {
    result['subscription.' + key] = activityUpdate[key]
    return result
  }, <{[id:string]:string}>{})
  return admin.firestore().collection('users').doc(uid)
    .collection('friends')
    .doc(friendUid)
    .update(subscriptionsUpdate)
}

export const deleteFriendByUid = (uid: string, friendUid: string) => {
  return admin.firestore().collection('users').doc(uid)
    .collection('friends')
    .doc(friendUid)
    .get()
    .then(function(docSnapshot) {
      return docSnapshot.ref.delete()
    })
}

const loadFriendRecords = (uid: string): Promise<up.FriendRecord[]> => {
  return admin.firestore().collection('users').doc(uid).collection('friends')
    .get().then(function(querySnapshot) {
      const friends: up.FriendRecord[] = []
      querySnapshot.forEach(function(friendDoc) {
        const record = friendDoc.data();
        friends.push({
          uid: record.uid,
          subscription: record.subscription
        })
      })
      return friends
    })
    .catch(function(error) {
      console.log("Error fetching list of friends: ", error);
      return [];
    });
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

export const loadInterestRegisterForUser = (uid: string, frienduids: string[]) => {
  return loadFriendRecords(uid)
    .then(function(allfriends) {
      return Promise.all(allfriends.filter(item => frienduids.includes(item.uid)).map((friend) => {
        return loadFriendRecords(friend.uid).then(function(friendsoffriend) {
          return { friend: friend, friends: friendsoffriend }
        })
      }))
    })
    .then(function(friendarrays) {
      return friendarrays.map((friendentry) => {
        const reflectedFriendRecord = friendentry.friends.find(item => item.uid === uid)
        if (reflectedFriendRecord !== undefined) {
          const activityList = [ 'play', 'out', 'move', 'relax' ].filter(activity => {
            if (reflectedFriendRecord.subscription !== undefined) {
              return reflectedFriendRecord.subscription[activity] !== false
            }
            return true
          })
          return { uid: friendentry.friend.uid, activity: activityList }
        } else {
          return null
        }
      }).filter(notEmpty).reduce(function(map, obj) {
        map[obj.uid] = obj
        return map
      }, <{[uid: string]: up.InterestRegister;}>{})
    })
}

export const loadInvites = (uid: string) => {
  return restrictToCurrentRecords(admin.firestore().collection('users').doc(uid).collection('invites'))
    .get()
    .then(function(querySnapshot) {
      const result: up.SavedUpRequest[] = []
      querySnapshot.forEach(function(doc) {
        const record = doc.data() as up.UpRequest;
        const savedRecord: up.SavedUpRequest = Object.assign({ id: doc.id, uid: uid }, record);
        result.push(savedRecord);
      });
      return result;
    })
    .catch(function(error) {
      console.log("Error fetching whats up: ", error);
      return [];
    })
    .then(function (invites) {
      const resolvedInvites: PromiseLike<up.SavedUpRequestWithAcceptedFriends[]>[] = []
      invites.forEach(function (invite) {
        resolvedInvites.push(
          admin.firestore().collection('up')
          .where("parentId", "==", invite.id)
          .get()
          .then(function(querySnapshot) {
            const upRecords: up.UpRecord[] = []
            querySnapshot.forEach(function(doc) {
              const record = doc.data() as up.UpRecord;
              upRecords.push(record)
            })
            return upRecords
          })
          .then(function(upRecords) {
            const upRecordPromisesWithFriend: PromiseLike<up.SavedUpRequestWithAcceptedFriends>[] = []
            upRecords.forEach(function(upRecord) {
               upRecordPromisesWithFriend.push(nameForUser(upRecord.inviteduid)
                 .then(function(username) {
                   if (upRecord.isUp) {
                     return Object.assign({acceptedFriends: [ username ], pendingFriends: []}, invite)
                   } else {
                     return Object.assign({acceptedFriends: [], pendingFriends: [ username ]}, invite)
                   }
                 })
               )
            })
            return Promise.all(upRecordPromisesWithFriend)
          }).then(function(upRecordsWithFriends) {
            /**
             * Handle the case here where no up records were created by the
             * invitation (because no friends were interested in the invite)
             */
            if (upRecordsWithFriends.length === 0) {
              return Promise.all(invite.friends.map(name => nameForUser(name)))
                .then(function(resolvedNames) {
                  return [ Object.assign({
                    pendingFriends: resolvedNames,
                    acceptedFriends: []
                  }, invite) ]
                })
            }
            return Promise.resolve(upRecordsWithFriends)
          })
        )
      })
      return Promise.all(resolvedInvites)
    })
    .then(function(inviteArrays) {
      const resultingInvites: { [id: string]: up.SavedUpRequestWithAcceptedFriends }= {}
      inviteArrays.forEach(function(inviteArray) {
        inviteArray.forEach(function(invite) {
          if (resultingInvites[invite.id] === undefined) {
            resultingInvites[invite.id] = invite
          } else {
            resultingInvites[invite.id].acceptedFriends = resultingInvites[invite.id].acceptedFriends.concat(invite.acceptedFriends)
            resultingInvites[invite.id].pendingFriends = resultingInvites[invite.id].pendingFriends.concat(invite.pendingFriends)
          }
        })
      })
      return Object.keys(resultingInvites).map(function(key) {
        return resultingInvites[key]
      })
    })
};

const loadUpByField = (field: string, uid: string) => {
  return restrictToCurrentRecords(admin.firestore().collection('up'))
    .where(field, "==", uid)
    .get()
    .then(function(querySnapshot) {
      const result: up.SavedUpRecord[] = []
      querySnapshot.forEach(function(doc) {
        const record = doc.data() as up.UpRecord;
        const savedRecord: up.SavedUpRecord = Object.assign({ id: doc.id }, record);
        result.push(savedRecord);
      });
      return result;
    })
    .catch(function(error) {
      console.log("Error fetching whats up: ", error);
      return [];
    });
}

export const respondToUp = (thisUserUid: string, upRecordId: string, isUp: boolean) => {
  return admin.firestore().collection('up').doc(upRecordId).get().then(docSnapshot => {
    if (docSnapshot.exists) {
      const docData = docSnapshot.data()
      if (docData !== undefined && docData.inviteduid === thisUserUid) {

        return docSnapshot.ref.update({ isUp: isUp }).then(writeResult => {
          return docData as up.SavedUpRecord;
        })
      } else {
        throw new Error('Document for ' + upRecordId + ' had no data')
      }
    } else {
      throw new Error('Document ' + upRecordId + ' does not exist')
    }
  })
};

export const loadUp = (uid: string) => {
  return loadUpByField("inviteduid", uid)
};

const resolveNames = (friends: up.FriendRecord[]) => {
  const entries: up.DirectoryEntry[] = []
  const promises: PromiseLike<void | up.DirectoryEntry>[] = []
  friends.forEach(function(friend) {
    promises.push(
      nameForUser(friend.uid).then(function(name) {
        if (name !== undefined) {
          entries.push(Object.assign({ name }, friend))
        }
      })
    )
  })
  return Promise.all(promises).then(function (results) {
    return entries
  })
}

export const loadFriends = (uid: string) => {
  console.log('Loading friends for user', uid)
  return loadFriendRecords(uid).then(function(frienduids: up.FriendRecord[]) {
    return resolveNames(frienduids)
  })
};

export const loadDirectory = (uid: string) => {
  return loadFriendRecords(uid).then(function(friendrecords: up.FriendRecord[]) {
    const promises: PromiseLike<up.FriendRecord[]>[] = []
    friendrecords.forEach(function (friendrecord) {
      promises.push(
        loadFriendRecords(friendrecord.uid).then(function (friendfriendrecords: up.FriendRecord[]) {
          if (friendfriendrecords.findIndex(item => item.uid === uid) !== -1) {
            return friendfriendrecords.filter(item => item.uid !== uid)
          } else {
            return []
          }
        })
      )
    })
    promises.push(Promise.resolve(friendrecords))
    return Promise.all(promises)
  }).then(function(friendrecordarrays: up.FriendRecord[][]) {
    const uniqueFriends: up.FriendRecord[] = [];
    const emptyArray: up.FriendRecord[] = [];
    emptyArray.concat.apply([], friendrecordarrays).forEach(function (friendrecord) {
      if (uniqueFriends.findIndex(item => item.uid === friendrecord.uid) === -1) {
        uniqueFriends.push(friendrecord)
      }
    })
    return resolveNames(uniqueFriends)
  })
};
