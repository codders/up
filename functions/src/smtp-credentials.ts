import { defineString } from 'firebase-functions/params';

const accessKeyId = defineString('SMTP_ACCESS_KEY_ID');
const secretAccessKey = defineString('SMTP_SECRET_ACCESS_KEY');

export const smtpCredentials = {
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: 'eu-west-1',
};
