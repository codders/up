import { loadSubscription, deleteSubscription, sendMessage } from './firebase-wrapper';
import * as up from './up-types';

const notifyUser: (arg0: string, arg1: Record<string, string>) => Promise<any> = function(target: string, message: Record<string,string>) {
  console.log('Sending notification to user ' + target + ' of type ' + message.messageType + ': ', message);
  return loadSubscription(target).then(token => {
    console.log('Loaded fcmToken: ', token);
    return sendMessage(token, message, {
      title: "Something's up!",
      body: "Check in the app to see what just happened"
    })
    .catch(err => {
      console.log('Error sending message - need to delete subscription');
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
    activity: JSON.stringify(record.activity),
    description: record.description
  })
};
