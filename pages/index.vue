<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <v-card>
        <v-card-title class="headline">
          {{ greetingString }}
        </v-card-title>
        <v-card-text v-if="!$store.getters.activeUser">
          <login-form />
        </v-card-text>
        <v-card-text v-else>
          <div v-if="$data.whatsUp.length === 0" jest="nothing-up">
            <p>Nothing's happening right now... Be the first to show up!</p>
          </div>
          <div v-else jest="something-up">
            <h2>Here's what's up right now...</h2>
            <whats-up
              v-for="invitation in $data.whatsUp"
              :key="invitation.uid"
              :uid="invitation.uid"
              :name="invitation.name"
              :activity="invitation.activity"
              :description="invitation.description"
            />
          </div>
          <v-list two-line jest="activities-list">
            <v-list-tile nuxt to="/up">
              <v-list-tile-title>Show Up</v-list-tile-title>
            </v-list-tile>
            <v-list-tile nuxt to="/friends">
              <v-list-tile-title>Show Friends</v-list-tile-title>
            </v-list-tile>
          </v-list>
          <div class="flexWrapper align-center" jest="logged-in-div">
            <h4 class="blue--text">
              You're logged in!
              <a @click="signOut">Logout</a>
            </h4>
            <v-btn icon class="blue white--text">
              <v-icon>thumb_up</v-icon>
            </v-btn>
          </div>
          <div v-if="pushSupport">
            <p>Your user agent supports notifications!</p>
          </div>
          <div v-else>
            <p>Sorry, your user agent does not support notifications :(</p>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import LoginForm from '~/components/LoginForm.vue'
import WhatsUp from '~/components/WhatsUp.vue'
import { vapidKey } from '@/model/vapid-key'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
}

export default {
  components: {
    LoginForm,
    WhatsUp
  },
  data() {
    return {
      hello: '',
      whatsUp: []
    }
  },
  computed: {
    displayName() {
      if (this.$store.state.profile != null) {
        return this.$store.state.profile.data.name
      } else {
        return null
      }
    },
    pushSupport() {
      return 'serviceWorker' in navigator && 'PushManager' in window
    },
    greetingString() {
      let greeting = 'Welcome to Up'
      if (this.displayName != null) {
        greeting = greeting + ', ' + this.displayName
      }
      return greeting
    }
  },
  async asyncData({ $axios, store }) {
    const whatsUpPromise = $axios
      .$get(
        'https://europe-west1-up-now-a6da8.cloudfunctions.net/app/whatsUp',
        {
          headers: {
            Authorization: 'Bearer ' + store.state.idToken
          }
        }
      )
      .then(response => {
        return { whatsUp: response }
      })
      .catch(error => {
        return { whatsUp: error }
      })
    const result = await whatsUpPromise
    return result
  },
  created: function() {
    const vm = this
    this.$log.debug('Page is loaded')
    this.askPermission()
      .then(result => {
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
            .then(registrations => {
              this.$log.debug(
                'service worker registrations: ' + registrations.length
              )
              for (const worker of registrations) {
                this.$log.debug('Service Worker:', worker)
                const subscribeOptions = {
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array(vapidKey.pub)
                }
                return worker.pushManager.subscribe(subscribeOptions)
              }
              throw new Error(
                'No Service worker found - unable to register subscription'
              )
            })
        }
      })
      .then(function(pushSubscription) {
        // eslint-disable-next-line no-console
        console.log(
          'Received PushSubscription: ',
          JSON.stringify(pushSubscription)
        )
        return vm.$axios({
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + vm.$store.state.idToken,
            'Content-Type': 'application/json'
          },
          data: JSON.stringify(pushSubscription),
          url:
            'https://europe-west1-up-now-a6da8.cloudfunctions.net/app/saveSubscription'
        })
      })
      .catch(error => {
        if (error) {
          this.$log.error(
            'Error asking for permission or subscribing to notification',
            error
          )
        }
      })
  },
  methods: {
    greetingText() {
      let greetingString = 'Welcome to Up'
      if (this.displayName != null) {
        greetingString = greetingString + ', ' + this.displayName
      }
      return greetingString
    },
    signOut() {
      this.$store.dispatch('signOut')
    },
    askPermission() {
      this.$log.debug('Asking for permission')
      return new Promise(function(resolve, reject) {
        const permissionResult = Notification.requestPermission(function(
          result
        ) {
          resolve(result)
        })

        if (permissionResult) {
          permissionResult.then(resolve, reject)
        }
      }).then(function(permissionResult) {
        if (permissionResult !== 'granted') {
          throw new Error("We weren't granted permission.")
        }
        return permissionResult
      })
    }
  }
}
</script>
