<template>
  <v-layout column align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline" jest="inviter-name">
          <p>{{ inviterName }} invited you to join up!</p>
        </v-card-title>
        <v-card-text>
          <p>Why not login and do that?</p>
          <div v-if="!emailAddressMatches" jest="email-mismatch">
            <p>This invite was intended for another user</p>
          </div>
          <div v-else>
            <div v-if="!$store.getters.activeUser" jest="login">
              <login-form />
            </div>
            <div v-else>
              <p>Accepting invite</p>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import LoginForm from '~/components/LoginForm.vue'

export default {
  components: {
    LoginForm
  },
  asyncData({ $axios, params, store }) {
    const headers = {}
    if (store.state.idToken !== null) {
      headers.Authorization = 'Bearer ' + store.state.idToken
    }
    return $axios
      .$get(
        'https://europe-west1-up-now-a6da8.cloudfunctions.net/app/invite/' +
          params.id,
        { headers }
      )
      .then(function(response) {
        if (
          store.getters.activeUser !== null &&
          store.state.profile.email === response.email
        ) {
          return $axios({
            method: 'post',
            url:
              'https://europe-west1-up-now-a6da8.cloudfunctions.net/app/invite/' +
              params.id,
            data: {
              accept: true
            },
            headers: Object.assign(
              { 'Content-Type': 'application/json' },
              headers
            )
          })
            .then(function(response) {
              return response.data
            })
            .catch(function(err) {
              console.log('Unable to accept invite', err) // eslint-disable-line no-console
            })
        }
        return response
      })
      .catch(function(err) {
        console.log('Unable to load invite', err) // eslint-disable-line no-console
        return {}
      })
  },
  data() {
    return {
      inviterName: null,
      email: null,
      accepted: false
    }
  },
  beforeMount() {
    if (this.inviterName === null) {
      this.$nuxt.$router.replace('/invite/unknown_invite')
      return
    }
    if (this.accepted === true) {
      this.$nuxt.$router.replace('/')
    }
  },
  computed: {
    emailAddressMatches() {
      return (
        this.$store.getters.activeUser === null ||
        this.email === this.$store.state.profile.email
      )
    }
  }
}
</script>
