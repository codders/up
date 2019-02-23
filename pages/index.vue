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
        <v-card-text>
          <p>Respond to the present moment, and find those who are in sync with you</p>
          <div class="text-xs-right">
            <em><small>&mdash; Arthur Taylor</small></em>
          </div>
          <hr class="my-3">
          <a
            href="https://github.com/codders/up"
            target="_blank"
          >Source Code</a>
          <br>
          <div class="mt-5">
            <div v-if="!$store.getters.activeUser">
              <login-form />
            </div>
            <div v-else class="flexWrapper align-center" jest="logged-in-div">
              <h4 class="blue--text">
                You're logged in!
              </h4>
              <v-btn icon class="blue white--text">
                <v-icon>thumb_up</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            nuxt
            to="/friends"
          >
            Show Friends
          </v-btn>
          <v-btn
            color="primary"
            flat
            nuxt
            to="/add-friend"
          >
            Add Friend 
          </v-btn>
        </v-card-actions>
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
  }
}
</script>
