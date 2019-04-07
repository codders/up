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
      <div class="text-xs-center">
        <logo />
        <vuetify-logo />
      </div>
      <v-card>
        <v-card-title class="headline">
          <span>Welcome to Up</span>
          <span v-if="displayName != null">, {{ displayName }}</span>
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
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import LoginForm from '~/components/LoginForm.vue'
import WhatsUp from '~/components/WhatsUp.vue'

export default {
  components: {
    Logo,
    VuetifyLogo,
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
  methods: {
    signOut() {
      this.$store.dispatch('signOut')
    }
  }
}
</script>
