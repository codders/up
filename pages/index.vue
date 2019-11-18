<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title jest="headline">
          {{ greetingString }}
        </v-card-title>
        <v-card-text v-if="!$store.getters.activeUser">
          <login-form />
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
    </v-flex>
  </v-layout>
</template>

<script>
import LoginForm from '~/components/LoginForm.vue'
import WhatsUpList from '~/components/WhatsUpList.vue'
import YouAreUpList from '~/components/YouAreUpList.vue'
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
    YouAreUpList,
    WhatsUpList
  },
  data() {
    return {
      hello: ''
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
    }
  },
  created() {
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
