import { smtpCredentials } from './smtp-credentials';
const AWS = require('aws-sdk')

AWS.config.update(smtpCredentials)

export const sendEmail: (arg0: string) => Promise<any> = function(target: string) {
  console.log('Sending mail')
  return new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail({
    Destination: {
      ToAddresses: [
        target
      ]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<p>You got notified!</p>
                 <br/>
                 <p>Sorry for the spam</p>`
        },
        Text: {
          Charset: 'UTF-8',
          Data: `You got notified!
          Sorry for the spam`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Notification from Up'
      }
    },
    Source: 'notifications@up.talkingcode.co.uk',
    ReplyToAddresses: [
      'no-reply@up.talkingcode.co.uk'
    ]
  }).promise()
}
