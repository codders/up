<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <pulse-loader :loading="loading" color="#b3d4fc"></pulse-loader>
      <notification-popup :visible="notificationVisible"></notification-popup>
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
                <h3 @click="toggle('q1')">What happens with my data?</h3>
                <div v-if="showParagraph.q1">
                  <p>
                    <em>Up</em> uses your login data to identify you to the
                    system and to other users.
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
                    your <b>e-mail address</b>, <b>name</b>, and a
                    <b>password</b>
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
            <v-btn color="primary" rounded nuxt to="/up"> Show Up </v-btn>
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

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import LoginForm from '~/components/LoginForm.vue'
import WhatsUpList from '~/components/WhatsUpList.vue'
import YouAreUpList from '~/components/YouAreUpList.vue'
import NotificationPopup from '~/components/NotificationPopup.vue'

export default {
  components: {
    LoginForm,
    YouAreUpList,
    WhatsUpList,
    PulseLoader,
    NotificationPopup,
  },
  data() {
    return {
      showParagraph: { q1: false, q2: false },
      loading: true,
      notificationVisible: false,
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
    this.loading = true
    this.$fire.auth
      .getRedirectResult()
      .then((result) => {
        if (result.user !== null) {
          return result.user.auth.currentUser.getIdToken().then((token) => {
            return this.$store.dispatch('userChanged', {
              user: result.user,
              idToken: token,
            })
          })
        } else {
          return Promise.resolve()
        }
      })
      .then(() => {
        return this.$store.dispatch('establishSession')
      })
      .then(() => {
        this.loading = false
      })
    this.$nuxt.$on('login-process-started', () => {
      this.loading = true
    })
  },
  methods: {
    toggle(element) {
      this.showParagraph[element] = !this.showParagraph[element]
    },
  },
}
</script>

<style>
.info-text {
  width: 400px;
}

h3 {
  cursor: pointer;
}
</style>
