# up

> Play with friends

## Setup

Create project with nuxt: https://nuxtjs.org/
Vuetify, Jest, SPA

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Deployment Setup

Login to firebase with

```
  firebase login
```

and initialise the project with

```
  firebase init
```

You will want to enable the database, storage and hosting modules. There will be a lot of questions, but the defaults are fine here, except that you should set the *public* folder to 'dist'.

You can then deploy your site with

```
  npm run build
  firebase deploy
```

or alternatively

```
  npm run fdeploy
```

## Test Firebase on localhost

To run the Firebase server locally:

```
  npm run build
  firebase serve
```

## Nuxt Firebase Auth setup

As described here: https://www.davidroyer.me/blog/nuxtjs-firebase-auth/ (plus some linting)

