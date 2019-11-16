import { smtpCredentials } from './smtp-credentials';
const AWS = require('aws-sdk')

AWS.config.update(smtpCredentials)

interface EmailTemplate {
  Html: string,
  Text: string,
  Subject: string
}

const templates = {
  invite: {
    Subject: `You are invited to join 'Up'`,
    Html: `<h2>Join Up!</h2>
    <div>
    <p>A friend has invited you to join their 'Up' network</p>
    <h3>What's 'Up'?</h3>
    <p>Up is an app / social network to make it easy for people to meet up
    spontaneously</p>
    <p>Visit <a href="https://up.talkingcode.co.uk">https://up.talkingcode.co.uk</a> to find out more!</p>
    </div>`,
    Text: `Join Up!
    A friend has invited you to join their 'Up' network

    What's up?
    Up is an app / social network to make it easy for people to meet up spontaneously

    Visit https://up.talkingcode.co.uk to find out more!`
  }
}

const sendEmail: (arg0: string, arg1: EmailTemplate) => Promise<any> = function(target: string, template: EmailTemplate) {
  console.log('Sending mail to ' + target)
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
          Data: template.Html
        },
        Text: {
          Charset: 'UTF-8',
          Data: template.Text
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: template.Subject
      }
    },
    Source: 'notifications@up.talkingcode.co.uk',
    ReplyToAddresses: [
      'no-reply@up.talkingcode.co.uk'
    ]
  }).promise()
}

export const sendInvitationEmail: (arg0: string) => Promise<any> = function(target: string) {
  return sendEmail(target, templates.invite)
}
