import { defineString } from 'firebase-functions/params';

import * as vapid from './vapid-key.d'

const secret = defineString('VAPID_PRIVATE_KEY');

export const vapidKey: vapid.Key = {
  pub: 'BLQkBvZj9rYZswcC2TWNn_3A296pI-qoShVTohIwE8Nq8H_lJIehIDTUjCaoGeVoNfopM6KFyiNKd-7YLNnnpuc',
  secret: secret
}
