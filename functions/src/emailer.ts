import { smtpCredentials } from './smtp-credentials';
import * as Moustache from 'mustache';
const AWS = require('aws-sdk')
const escape = require('escape-html')

interface EmailTemplate {
  Html: string,
  Text: string,
  Subject: string
}

let awsConfigured = false;

const setupAws = function() {
  AWS.config.update({
    accessKeyId: smtpCredentials.accessKeyId.value(),
    secretAccessKey: smtpCredentials.secretAccessKey.value(),
    region: smtpCredentials.region
  });
  awsConfigured = true;
}

const templates = {
  invite: {
    Subject: `You are invited to join 'Up'`,
    Html: `<h2>Join Up!</h2>
    <div>
    <p>{{friendname}} has invited you to join their 'Up' network</p>
    <h3>What's 'Up'?</h3>
    <p>Up is an app / social network to make it easy for people to meet up
    spontaneously</p>
    <p>Visit <a href="https://up.codders.io/invite?key={{inviteid}}">https://up.codders.io/invite?key={{inviteid}}</a> to find out more!</p>
    </div>`,
    Text: `Join Up!
    {{friendname}} has invited you to join their 'Up' network

    What's up?
    Up is an app / social network to make it easy for people to meet up spontaneously

    Visit https://up.codders.io/invite?key={{inviteid}} to find out more!`
  }
}

const sendEmail: (arg0: string, arg1: EmailTemplate, arg2: {[id:string]: string}) => Promise<any> = function(target: string, template: EmailTemplate, templateData: {[id:string]: string}) {
  console.log('Sending mail to ' + target)
  if (!awsConfigured) {
    setupAws()
  }
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
          Data: Moustache.render(template.Html, Object.keys(templateData).reduce(function(result, key) {
            result[key] = escape(templateData[key])
            return result
          }, <{[id:string]: string}>{}))
        },
        Text: {
          Charset: 'UTF-8',
          Data: Moustache.render(template.Text, templateData)
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: Moustache.render(template.Subject, templateData)
      }
    },
    Source: 'notifications@up.codders.io',
    ReplyToAddresses: [
      'no-reply@up.codders.io'
    ]
  }).promise()
}

export const sendInvitationEmail: (arg0: string, arg1: string, arg2: string) => Promise<any> = function(target: string, inviteId: string, sourceName: string) {
  const templateData = {
    friendname: sourceName,
    inviteid: inviteId
  }
  return sendEmail(target, templates.invite, templateData)
}
