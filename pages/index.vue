<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <pulse-loader :loading="loading" color="#b3d4fc"></pulse-loader>
      <div v-if="!loading">
        <v-card>
          <v-card-title jest="headline">
            {{ greetingString }}
          </v-card-title>
          <v-card-text v-if="!$store.getters.activeUser">
            <v-row>
              <v-col class="info-text">
                <p>
                  Sign in to start sending and receiving notifications from your
                  friends of opportunities to meet up and hang out!
                </p>
              </v-col>
            </v-row>
            <login-form />
            <v-row>
              <v-col class="info-text">
                <h2>Privacy FAQ</h2>
                <h3 @click="toggle('q1')">
                  What happens with my data?
                </h3>
                <div v-if="showParagraph.q1">
                  <p>
                    <em>Up</em> uses your login data to identify you to the system
                    and to other users.
                  </p>
                  <p>
                    <b>If you login with Google</b> an app-specific ID will be
                    generated that will be used to identify you in <em>Up</em>'s
                    database. Your <b>e-mail address</b>, <b>name</b> and
                    <b>profile photo URL</b> will be copied to the <em>Up</em>
                    database.
                  </p>
                  <p>
                    <b>If you login with e-mail</b>, you will be asked to supply
                    your <b>e-mail address</b>, <b>name</b>, and a <b>password</b>
                    that will be used to create your profile. An app-specific ID
                    will be generated that will be used to identify you in
                    <em>Up</em>'s database.
                  </p>
                </div>
                <h3 @click="toggle('q2')">
                  What will other users know about me?
                </h3>
                <p v-if="showParagraph.q2">
                  To support the app's functionality, your <b>name</b> will be
                  made visible to other users who add you by e-mail address, and
                  to their friends.
                </p>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-else>
            <whats-up-list />
            <you-are-up-list />
            <v-btn color="primary" rounded nuxt to="/up">
              Show Up
            </v-btn>
            <div v-if="$store.getters.activeUser" jest="logged-in-div" />
            <div v-if="!pushSupport">
              <p>Sorry, your user agent does not support notifications :(</p>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-flex>
  </v-layout>
</template>

<style>
.info-text {
  width: 400px;
}

h3 {
  cursor: pointer;
}
</style>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { vapidKey } from '@/model/vapid-key'
import LoginForm from '~/components/LoginForm.vue'
import WhatsUpList from '~/components/WhatsUpList.vue'
import YouAreUpList from '~/components/YouAreUpList.vue'
import { API_BASE_URL } from '@/model/api'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

export default {
  components: {
    LoginForm,
    YouAreUpList,
    WhatsUpList,
    PulseLoader,
  },
  data() {
    return {
      showParagraph: { q1: false, q2: false },
      loading: true
    }
  },
  computed: {
    pushSupport() {
      return 'serviceWorker' in navigator && 'PushManager' in window
    },
    greetingString() {
      const greeting = 'Welcome to Up'
      if (this.$store.state.profile.name != null) {
        return greeting + ', ' + this.$store.state.profile.name
      } else {
        return greeting
      }
    },
  },
  created() {
    const vm = this
    this.$fire.auth.getRedirectResult().then((result) => {
      if (result.user !== null) {
        return result.user.auth.currentUser.getIdToken().then((token) => {
          return this.$store.dispatch("userChanged", { user: result.user, idToken: token })
        })
      } else {
        return Promise.resolve()
      }
    }).then(() => {
      this.loading = false
    })
    this.$nuxt.$on('login-process-started', () => {
      this.loading = true;
    })
    this.askPermission()
      .then((result) => {
        this.$log.debug('Got permission result', result)
        if (result !== 'granted') {
          this.$log.info(
            'Notifications are blocked for this page. Go to settings to unblock them'
          )
          throw new Error('Notifications are blocked')
        }
        if ('serviceWorker' in navigator) {
          return navigator.serviceWorker
            .getRegistrations()
            .then((registrations) => {
              this.$log.debug(
                'service worker registrations: ' + registrations.length
              )
              for (const worker of registrations) {
                this.$log.debug('Service Worker:', worker)
                const subscribeOptions = {
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array(vapidKey.pub),
                }
                return worker.pushManager.subscribe(subscribeOptions)
              }
              throw new Error(
                'No Service worker found - unable to register subscription'
              )
            })
        }
      })
      .then(function (pushSubscription) {
        // eslint-disable-next-line no-console
        console.log(
          'Received PushSubscription: ',
          JSON.stringify(pushSubscription)
        )
        return vm.$axios({
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + vm.$store.state.idToken,
            'Content-Type': 'application/json',
          },
          data: JSON.stringify(pushSubscription),
          url:
            API_BASE_URL + '/saveSubscription',
        })
      })
      .catch((error) => {
        if (error) {
          this.$log.error(
            'Error asking for permission or subscribing to notification',
            error
          )
        }
      })
  },
  methods: {
    toggle(element) {
      this.showParagraph[element] = !this.showParagraph[element]
    },
    askPermission() {
      this.$log.debug('Asking for permission')
      return new Promise(function (resolve, reject) {
        const permissionResult = Notification.requestPermission(function (
          result
        ) {
          resolve(result)
        })

        if (permissionResult) {
          permissionResult.then(resolve, reject)
        }
      }).then(function (permissionResult) {
        if (permissionResult !== 'granted') {
          throw new Error("We weren't granted permission.")
        }
        return permissionResult
      })
    },
  },
}
</script>
