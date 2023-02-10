import { defineString } from 'firebase-functions/params';

import * as vapid from './vapid-key.d';

const secret = defineString('VAPID_PRIVATE_KEY');
const pub = defineString('VAPID_PUBLIC_KEY');

export const vapidKey: vapid.Key = {
  pub: pub,
  secret: secret,
};
