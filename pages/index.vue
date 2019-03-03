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
          Welcome to Up
        </v-card-title>
        <v-card-text v-if="!$store.getters.activeUser">
          <login-form />
        </v-card-text>
        <v-card-text v-else>
          <p>Greetings: {{ $data.hello }}</p>
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

export default {
  components: {
    Logo,
    VuetifyLogo,
    LoginForm
  },
  async asyncData({ $axios, store }) {
    const hello = await $axios
      .$get(
        'https://europe-west1-up-now-a6da8.cloudfunctions.net/app/helloWorld',
        {
          headers: {
            Authorization: 'Bearer ' + store.state.idToken
          }
        }
      )
      .then(response => {
        return { hello: response }
      })
      .catch(error => {
        return { hello: error }
      })
    return { hello: hello }
  }
}
</script>
