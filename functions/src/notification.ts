import { loadSubscription, deleteSubscription } from './firebase-wrapper';
import * as webPush from 'web-push';
import { vapidKey } from './vapid-key';
import * as up from './up-types';

let loaded = false;

const setupWebpush = function() {
  webPush.setVapidDetails(
    'mailto: arthur.taylor@gmail.com',
    vapidKey.pub,
    vapidKey.secret.value()
  );
  loaded = true;
}

const notifyUser: (arg0: string, arg1: any) => Promise<any> = function(target: string, message: any) {
  console.log('Sending notification to user ' + target + ' of type ' + message.messageType + ': ', message);
  if (!loaded) {
    setupWebpush();
  }
  return loadSubscription(target).then(subscription => {
    console.log('Loaded subscription: ', subscription);
    return webPush.sendNotification(subscription, JSON.stringify(message))
    .catch(err => {
      console.log('Need to delete subscription');
      return deleteSubscription(target).then((deleteResult) => {
        console.log('Subscription deleted', deleteResult);
        if (err.statusCode === 410) {
          return {
            success: false,
            uid: target,
            message: 'Subscription expired (410)'
          };
        } else {
          console.log('Subscription is no longer valid: ', err);
          return {
            success: false,
            uid: target,
            message: 'Subscription is no longer valid: ' + err
          }
        }
      })
    });
  })
  .catch(err => {
    console.log('Error loading subscription', err);
    return {
      success: false,
      uid: target,
      message: 'Error loading subscription ' + err
    }
  })
};

export const sendShowUpNotification: (arg0: up.UpRecordWithName) => Promise<any> = function(record: up.UpRecordWithName) {
  console.log('Sending show up notification to user ' + record.inviteduid + ': ', record);
  return notifyUser(record.inviteduid, {
    messageType: "SHOW_UP",
    name: record.name,
    description: record.description
  })
};

export const sendUpMatchNotification: (arg0: string, arg1: up.UpRecord) => Promise<any> = function(senderName: string, record: up.UpRecord) {
  console.log('Sending match notification to user ' + record.uid + ': ', record);
  return notifyUser(record.uid, {
    messageType: "MATCH",
    name: senderName,
    activity: record.activity,
    description: record.description
  })
};
