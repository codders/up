import colors from 'vuetify/es5/util/colors'

const logOptions = {
  // optional : defaults to true if not specified
  isEnabled: true,
  // required ['debug', 'info', 'warn', 'error', 'fatal']
  logLevel : 'debug',
  // optional : defaults to false if not specified
  stringifyArguments : false,
  // optional : defaults to false if not specified
  showLogLevel : false,
  // optional : defaults to false if not specified
  showMethodName : false,
  // optional : defaults to '|' if not specified
  separator: '|',
  // optional : defaults to false if not specified
  showConsoleColors: false
}

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - up',
    title: 'up',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',
    ['nuxt-log', logOptions],
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyAKjfV-PFotzvI9a3UHTLfnkITGpb-3G4Q',
          authDomain: 'up-now-a6da8.firebaseapp.com',
          databaseURL: 'https://up-now-a6da8.firebaseio.com',
          projectId: 'up-now-a6da8',
          storageBucket: 'up-now-a6da8.appspot.com',
          messagingSenderId: '884424894711',
          appId: 'up-now-a6da8',
        },
        services: {
          auth: true,
          firestore: true,
        }
      }
    ]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Firebase Auth Configuration
  auth: {
    initialize: {
      onAuthStateChangedAction: 'userChanged',
      subscribeManually: false,
    },
  },

  // Firebase Firestore config
  firestore: {
    enablePersistence: {
      synchronizeTabs: true
    },
  },

  proxy: {
    '/app/': {
      target: 'https://europe-west1-up-now-a6da8.cloudfunctions.net/',
      changeOrigin: true
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: {
      font: true,
      icons: 'md'
    },
    icons: {
      iconfont: 'md'
    },
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
