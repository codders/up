import { defineString } from 'firebase-functions/params';

import * as vapid from './vapid-key.d'

const secret = defineString('VAPID_PRIVATE_KEY');

export const vapidKey: vapid.Key = {
  pub: 'BEKqi0e5QHLlVr6jcMMFwIgCY0-5K_ro-0K9rHGR515s6s6ULSGmgZdR4a3Rr6djy_Wrx9NcjXIE7toeiKtmVx0',
  secret: secret
}
