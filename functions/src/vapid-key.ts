import * as vapid from './vapid-key.d'

const secret = process.env.VAPID_PRIVATE_KEY;
if (secret === undefined) {
  throw("Vapid key not set! Check firebase environment setup")
}

export const vapidKey: vapid.Key = {
  pub: 'BLQkBvZj9rYZswcC2TWNn_3A296pI-qoShVTohIwE8Nq8H_lJIehIDTUjCaoGeVoNfopM6KFyiNKd-7YLNnnpuc',
  secret: secret
}
