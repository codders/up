import * as expressTypes from './express-types';
import * as functions from 'firebase-functions';
import * as up from './up-types';
import {
  validateFirebaseIdToken,
  saveUp,
  loadUp,
  loadInvites,
  deleteUpRecordsByInvite,
  loadDirectory,
  loadProfile,
  updateProfile,
  loadFriends,
  lookupUserByEmail,
  createSignupInvitation,
  loadSignupInvitation,
  acceptSignupInvitation,
  loadInterestRegisterForUser,
  addFriendRecord,
  setSubscriptionStatusForFriend,
  deleteFriendByUid,
  nameForUser,
  respondToUp,
  populateInviteRecord,
  saveInviteRecordForUser,
  saveSubscription,
  createCustomAuthToken,
  saveDiscordUserDetails,
} from './firebase-wrapper';
import {
  findMatches,
  getUpRecordsForRequest,
  objectToProfileDetails,
} from './up-logic';
import {
  sendShowUpNotification,
  sendUpMatchNotification,
} from './notification';
import { sendInvitationEmail } from './emailer';
import { generateDiscordAuthUrl, fetchDiscordAccessToken } from './discord';

const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: 'https://up.codders.io',
};

app.use(validateFirebaseIdToken);
app.use(cors(corsOptions));
app.use(cookieParser);
app.options('*', cors(corsOptions));

app.delete(
  '/up/:id',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    console.log(
      'Deleting up record ' +
        request.params.id +
        ' at ' +
        request.user.email +
        "'s request",
    );
    deleteUpRecordsByInvite(request.params.id, request.user.uid)
      .then((writeResult) => {
        response.status(200).send({ id: request.params.id });
      })
      .catch((err) => {
        console.log('Unable to delete record:', err);
        response.status(500).send({ error: err });
      });
  },
);
app.post(
  '/up/:id',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    console.log('Got post body', request.body);
    console.log(
      "Responding to what's up " +
        request.params.id +
        ' for ' +
        request.user.email +
        ':' +
        request.user.uid,
    );
    respondToUp(request.user.uid, request.params.id, request.body.isUp)
      .then((result) => {
        if (request.body.isUp) {
          return nameForUser(request.user.uid)
            .then((name) => {
              return sendUpMatchNotification(name, result);
            })
            .catch((err) => {
              console.log('Unable to load name for user: ', err);
              return err;
            });
        } else {
          return Promise.resolve(result);
        }
      })
      .catch((err) => {
        console.log('Unable to send up match notification', err);
        response.status(500).send({ error: err });
      })
      .then((result) =>
        loadUp(request.user.uid)
          .then((whatsUp) => {
            response.status(200).send(findMatches(whatsUp));
          })
          .catch((err) => {
            console.log('Unable to load up records after response', err);
          }),
      )
      .catch((err) => {
        console.log('Unable to record response', err);
        response.status(500).send({ error: err });
      });
  },
);
app.get(
  '/profile',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    console.log('Loading profile for user ' + request.user.uid);
    loadProfile(request.user.uid)
      .then((profile) => {
        response.status(200).send(profile);
      })
      .catch((err) => {
        console.log('Unable to load profile', err);
        response.status(201).send({ id: request.user.uid });
      });
  },
);
app.post(
  '/profile',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    console.log('Updating profile for user ' + request.user.uid);
    updateProfile(request.user.uid, objectToProfileDetails(request.body))
      .then((profile) => {
        response.status(201).send(profile);
      })
      .catch((err) => {
        console.log('Unable to save profile', err);
        response.status(500).send({ message: 'Error updating profile' });
      });
  },
);
app.get(
  '/myUp',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    console.log(
      'Checking what ' +
        request.user.email +
        ':' +
        request.user.uid +
        ' is up for',
    );
    loadInvites(request.user.uid)
      .then((whatsUp) => {
        response.status(200).send(whatsUp);
      })
      .catch((err) => {
        console.log("Unable to work out what's up", err);
      });
  },
);
app.get(
  '/whatsUp',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    console.log(
      "Checking what's up for " + request.user.email + ':' + request.user.uid,
    );
    loadUp(request.user.uid)
      .then((whatsUp) => {
        response.status(200).send(findMatches(whatsUp));
      })
      .catch((err) => {
        console.log("Unable to work out what's up", err);
      });
  },
);
app.get(
  '/directory',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    loadDirectory(request.user.uid)
      .then((directory) => {
        response.status(200).send(directory);
      })
      .catch((err) => {
        console.log('Unable to fetch the directory');
      });
  },
);
app.get(
  '/friends',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    loadFriends(request.user.uid)
      .then((friends) => {
        response.status(200).send(friends);
      })
      .catch((err) => {
        console.log('Unable to fetch the list of friends');
      });
  },
);
app.post(
  '/friends',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    const friend = Object.assign({}, request.body);
    addFriendRecord(request.user.uid, friend.uid)
      .then((writeResult) => {
        response.status(201).send({
          uid: friend.uid,
          name: friend.name,
        });
      })
      .catch((err) => {
        console.log('Unable to add friend');
      });
  },
);
app.post(
  '/friends/:id/subscriptions',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    const activityUpdate = Object.assign({}, request.body);
    setSubscriptionStatusForFriend(
      request.user.uid,
      request.params.id,
      activityUpdate,
    )
      .then((writeResult) => {
        response.status(201).send(activityUpdate);
      })
      .catch((err) => {
        console.log('Unable to update subscription information for friend');
      });
  },
);
app.delete(
  '/friends/:id',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    console.log(
      'Deleting friend ' + request.params.id + ' for ' + request.user.uid,
    );
    deleteFriendByUid(request.user.uid, request.params.id)
      .then((writeResult) => {
        response.status(200).send({ uid: request.params.id });
      })
      .catch((err) => {
        console.log('Unable to delete friend:', err);
        response.status(500).send({ error: err });
      });
  },
);
app.post(
  '/saveRecord',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    const record = Object.assign({}, request.body);
    nameForUser(request.user.uid)
      .then(function (userName) {
        const parentUpRequest: up.UpRequest = {
          activity: record.activity,
          description: record.description,
          friends: record.friends,
        };
        return Promise.all([
          saveInviteRecordForUser(request.user.uid, parentUpRequest),
          loadInterestRegisterForUser(request.user.uid, record.friends),
        ]).then(function (results) {
          console.log('Loaded interest register', results);
          Object.values(results[1]).forEach(function (friend) {
            console.log('Friend', friend);
          });
          const parentRecordId: string = results[0];
          const interestRegister: { [uid: string]: up.InterestRegister } =
            results[1];
          const upRequest = Object.assign(parentUpRequest, {
            id: parentRecordId,
            uid: request.user.uid,
          });
          const upRecords = getUpRecordsForRequest(
            upRequest,
            userName,
            interestRegister,
          );
          console.log('Saving data: ', upRecords);
          const promises: PromiseLike<String>[] = [];
          upRecords.forEach(function (upRecord: up.UpRecordWithName) {
            const { name, ...upRecordWithoutName } = upRecord;
            promises.push(
              saveUp(upRecordWithoutName).then((writeResult) => {
                return sendShowUpNotification(upRecord);
              }),
            );
          });
          Promise.all(promises)
            .then((writeResults) => {
              console.log('Got write results', writeResults);
              return populateInviteRecord(request.user.uid, upRequest).then(
                function (invite) {
                  response.status(201).send({
                    success: true,
                    message: 'You are up!',
                    upRequest: invite,
                  });
                },
              );
            })
            .catch((err) => {
              console.log('Error writing record', err);
              response.status(500).send({
                success: false,
                message: err,
              });
            });
        });
      })
      .catch((err) => {
        console.log('Unable to load name for user: ', err);
        response.status(500).send({
          success: false,
          message: err,
        });
      });
  },
);

app.post(
  '/saveSubscription',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    const subscription = Object.assign({}, request.body);
    console.log('Saving subscription: ', subscription);
    saveSubscription(subscription, request.user.uid)
      .then((writeResults) => {
        console.log('Got subscription write result', writeResults);
        response.status(201).send({
          success: true,
          message: 'Subscription updated',
        });
      })
      .catch((err) => {
        console.log('Error saving subscription', err);
      });
  },
);

app.post(
  '/addFriendByEmail',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    const email = Object.assign({}, request.body).email;
    console.log('Adding friend by email: ', email);
    lookupUserByEmail(email)
      .then((friend) => {
        addFriendRecord(request.user.uid, friend.id)
          .then((writeResults) => {
            console.log('Got friend add result', writeResults);
            response.status(201).send({
              uid: friend.id,
              name: friend.name,
              photoURL: friend.photoURL,
            });
          })
          .catch((err) => {
            console.log('Unable to save friend record', err);
            response.status(500).send({
              message: 'Unable to save friend record',
            });
          });
      })
      .catch((err) => {
        console.log('Error adding friend', err);
        response.status(404).send({
          code: 'NOT_FOUND',
          message: 'Unable to find friend record ' + err,
        });
      });
  },
);

app.post(
  '/inviteFriendByEmail',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    const email = Object.assign({}, request.body).email;
    console.log('Inviting friend by email: ', email);
    lookupUserByEmail(email)
      .then((friend) => {
        console.log('email exists in system - not sending invite');
        response.status(409).send({
          code: 'ALREADY_EXISTS',
          message: 'Email address matches existing user',
        });
      })
      .catch((err) => {
        console.log('Email not found in system - sending invitation', err);
        return nameForUser(request.user.uid).then((name) => {
          createSignupInvitation(request.user.uid, email)
            .then((inviteid) => {
              sendInvitationEmail(email, inviteid, name)
                .then((result) => {
                  console.log('Email sent');
                  response.status(201).send({
                    message: 'Invitation sent',
                  });
                })
                .catch((inviteerr) => {
                  console.log('Error sending invitation', inviteerr);
                  response.status(500).send({
                    message: 'Unable to send invitation',
                  });
                });
            })
            .catch((error) => {
              console.log('Unable to create signup invite record', error);
              response.status(500).send({
                message: 'Unable to create signup invite record',
              });
            });
        });
      });
  },
);

/** Unauthenticated Routes - see validateFirebaseToken */
app.get(
  '/discord/login',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    console.log('Redirecting to discord auth user');
    if (
      request.headers.referer === undefined ||
      request.headers.referer === ''
    ) {
      response.status(403).send({ message: 'no referer header set' });
      return;
    }
    response.redirect(301, generateDiscordAuthUrl(request.headers.referer));
  },
);

app.post(
  '/discord/token',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    console.log('Fetching discord oauth token');
    // per https://discordjs.guide/oauth2/#authorization-code-grant-flow
    if (request.headers.origin === undefined || request.headers.origin === '') {
      response.status(403).send({ message: 'no origin header set' });
      return;
    }
    const code = request.body.code;
    if (code === undefined) {
      response.status(401).send({ message: 'Bad request - no code supplied' });
      return;
    }
    fetchDiscordAccessToken(code.toString(), request.headers.origin + '/')
      .then((discordToken) => {
        return createCustomAuthToken(discordToken).then((discordAuth) => {
          return saveDiscordUserDetails(discordToken, discordAuth).then(() => {
            response.status(201).send(discordAuth);
          });
        });
      })
      .catch((err) => {
        console.log('Error creating discord access token', err);
        response
          .status(500)
          .send({ error: 'API Error creating custom token (see logs)' });
      });
  },
);

app.get(
  '/invite/:id',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    console.log(
      'Loading invite ' + request.params.id + ' user is',
      request.user,
    );
    loadSignupInvitation(request.params.id)
      .then((invite) => {
        return nameForUser(invite.inviter).then((name) => {
          response
            .status(200)
            .send(Object.assign({ inviterName: name }, invite));
        });
      })
      .catch((err) => {
        console.log('Unable to load invite', err);
        response.status(404).send({ message: 'no such invite' });
      });
  },
);

app.post(
  '/invite/:id',
  (request: expressTypes.Request, response: expressTypes.Response) => {
    console.log(
      'Accepting invite ' + request.params.id + ' user is',
      request.user,
    );
    if (request.user === undefined || request.user.uid === undefined) {
      response
        .status(403)
        .send({ message: 'You need to log in to accept and invite' });
      return;
    }
    loadSignupInvitation(request.params.id)
      .then((invite) => {
        return nameForUser(invite.inviter).then((name) => {
          const inviteWithName = Object.assign({ inviterName: name }, invite);
          return acceptSignupInvitation(request.user.uid, inviteWithName).then(
            (result) => {
              response
                .status(201)
                .send(Object.assign({ accepted: true }, inviteWithName));
            },
          );
        });
      })
      .catch((err) => {
        console.log('Unable to accept invite', err);
        response.status(404).send({ message: 'no such invite' });
      });
  },
);

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.region('europe-west1').https.onRequest(app);
