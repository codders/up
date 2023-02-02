const accessKeyId = process.env.SMTP_ACCESS_KEY_ID
const secretAccessKey = process.env.SMTP_SECRET_ACCESS_KEY

if (accessKeyId === undefined || secretAccessKey === undefined) {
  throw("SMTP credentials not set! Check firebase environment setup")
}

export const smtpCredentials = {
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: 'eu-west-1'
}
