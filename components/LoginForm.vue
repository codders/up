<template>
  <v-layout>
    <v-flex text-xs-center xs12 sm6 offset-sm3>
      <h2 class="title">
        Sign In with Google
      </h2>
      <v-btn class="signIn mb-2" primary @click.native="googleSignUp">
        Google Sign In
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      formEmail: '',
      formPassword: ''
    }
  },
  methods: {
    emailLogin() {
      const log = this.$log
      this.$store
        .dispatch('signInWithEmail', {
          email: this.formEmail,
          password: this.formPassword
        })
        .then(() => {
          this.formEmail = ''
          this.formPassword = ''
        })
        .catch(e => {
          log.error(e.message)
        })
    },
    googleSignUp() {
      const log = this.$log
      this.$store
        .dispatch('signInWithGoogle')
        .then(() => {
          log.debug('inside then statement on login')
        })
        .catch(e => {
          log.error(e.message)
        })
    }
  }
}
</script>

<style lang="css">
.signIn {

}
</style>
