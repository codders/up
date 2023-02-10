[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

# up

> Play with friends

## Setup

Create project with nuxt: https://nuxtjs.org/
Vuetify, Jest, SPA

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Deployment Setup

Login to firebase with

```bash
  firebase login
```

and initialise the project with

```bash
  firebase init
```

You will want to enable the database, storage and hosting modules. There will be a lot of questions, but the defaults are fine here, except that you should set the _public_ folder to 'dist'.

You can then deploy your site with

```bash
  npm run build
  firebase deploy
```

or alternatively

```bash
  npm run fdeploy
```

Additional configuration for push notifications and e-mail sending is described below. If you haven't created the associated configuration files `vapid-key.ts`, `vapid-key.js` and `smtp-credentials.ts`, your build / deploy my fail with an error.

## Test Firebase on localhost

To run the Firebase server locally:

```bash
  npm run build
  firebase serve
```

## Nuxt Firebase Auth setup

As described here: https://www.davidroyer.me/blog/nuxtjs-firebase-auth/ (plus some linting)

## Push notifications

There is support for push notifications in the application. You will need to generate the Application Server Keys, as described here: https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user

When you have your Vapid Key, you will need to create a file `./functions/src/vapid-key.ts` with the following content:

```typescript
export const vapidKey: vapid.Key = {
  pub: '[YOUR PUBLIC KEY]',
  secret: '[YOUR PRIVATE KEY]',
}
```

and on the client side, a corresponding file with just the public part that the client can use at `./model/vapid-key.js`:

```javascript
export const vapidKey = {
  pub: '[YOUR PUBLIC KEY]',
}
```

## Email sending functionality

The server sends emails to users to enable features like non-push notifications and invitations. The current implementation uses AWS SES. You will need to generate API keys for an IAM user with permission for `SendEmail` and `SendRawEmail`, and include the details in a file in `./functions/src/smtp-credentials.ts`:

```typescript
export const smtpCredentials = {
  accessKeyId: '[YOUR ACCESS KEY ID]',
  secretAccessKey: '[YOUR SECRET ACCESS KEY]',
  region: '[YOUR AWS REGION]',
}
```

## Troubleshooting

### Startup errors in dev

If you have trouble running the development server, it might be that there are not enough kernel watches available. You might see an 'ENOSPC' error from Node when you run `npm run dev`. In this case:

```bash
sudo sysctl fs.inotify.max_user_watches=524288
```

### User login errors on mobile / web

If you are unable to login to up, check in the browser console what errors you see.

If you see `xsrfmanager undefined reference`, try disabling extensions like Ad Block or HTTPS Everywhere.

If login is failing silently and just returning you to the landing page, check that you have third-party cookies enabled in your browser security / privacy settings.
