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
import { API_BASE_URL } from '@/model/api'

function postInviteAcceptance(axios, idToken, inviteId) {
  return axios({
    method: 'post',
    url:
      API_BASE_URL + '/invite/' +
      inviteId,
    data: {
      accept: true,
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
  })
}

export default {
  components: {
    LoginForm,
  },
  asyncData({ $axios, params, store }) {
    const headers = {}
    if (store.state.idToken !== null && store.state.idToken !== undefined) {
      headers.Authorization = 'Bearer ' + store.state.idToken
    }
    return $axios
      .$get(
        API_BASE_URL + '/invite/' +
          params.id,
        { headers }
      )
      .then(function (response) {
        if (
          store.getters.activeUser !== null &&
          store.getters.activeUser.email === response.email
        ) {
          return postInviteAcceptance($axios, store.state.idToken, params.id)
            .then(function (response) {
              return response.data
            })
            .catch(function (err) {
              console.log('Unable to accept invite', err) // eslint-disable-line no-console
            })
        } else {
          // esline-disable-next-line no-console
          console.log(
            'not yet logged in - not sending invite',
            store.getters.activeUser
          )
        }
        return response
      })
      .catch(function (err) {
        console.log('Unable to load invite', err) // eslint-disable-line no-console
        return {}
      })
  },
  data() {
    return {
      inviterName: null,
      email: null,
      accepted: false,
    }
  },
  computed: {
    emailAddressMatches() {
      return (
        this.$store.getters.activeUser === null ||
        this.email === this.$store.getters.activeUser.email
      )
    },
    loggedIn() {
      return this.$store.getters.activeUser !== null
    },
  },
  watch: {
    loggedIn(newValue, oldValue) {
      const vm = this
      console.log('Logged In changed from ' + oldValue + ' to ' + newValue) // eslint-disable-line no-console
      if (oldValue === false && newValue === true) {
        postInviteAcceptance(
          this.$axios,
          this.$store.state.idToken,
          this.$route.params.id
        ).then(function (result) {
          console.log('Accepted invite') // eslint-disable-line no-console
          vm.$nuxt.$router.replace('/')
        })
      }
    },
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
}
</script>
