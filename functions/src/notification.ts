import { loadSubscription } from './firebase-wrapper';
import { setVapidDetails, sendNotification } from 'web-push';
import { vapidKey } from './vapid-key';

setVapidDetails(
  'mailto: arthur.taylor@gmail.com',
  vapidKey.pub,
  vapidKey.secret
);

export const notifyUser: (arg0: up.UpRecord) => Promise<any> = function(record: up.UpRecord) {
  console.log('Sending notification to user ' + record.inviteduid + ': ', record);
  return loadSubscription(record.inviteduid).then(subscription => {
    console.log('Loaded subscription: ', subscription);
    return sendNotification(subscription, JSON.stringify({
        activity: record.activity
      })
    )
    .catch(err => {
      if (err.statusCode === 410) {
        console.log('Need to delete subscription');
        return {
          success: false,
          uid: record.inviteduid,
          message: 'Subscription expired (410)'
        };
      } else {
        console.log('Subscription is no longer valid: ', err);
        return {
          success: false,
          uid: record.inviteduid,
          message: 'Subscription is no longer valid: ' + err
        }
      }
    });
  })
  .catch(err => {
    console.log('Error loading subscription', err);
    return {
      success: false,
      uid: record.inviteduid,
      message: 'Error loading subscription ' + err
    }
  })
};
