<template>
  <v-layout>
    <v-flex text-xs-center>
      <div v-if="showLoginButtons">
        <h2 class="title mb-2">
          Sign In with
        </h2>
        <div class="login-buttons spread">
          <v-btn
            class="signin mr-2"
            color="primary"
            @click.native="googleSignUp"
          >
            Google
          </v-btn>
          <v-spacer />
          <v-btn class="signin" color="primary" @click.native="showEmailForm">
            E-Mail
          </v-btn>
        </div>
      </div>
      <div v-if="showEmailLoginForm">
        <h2 class="title mb-2">{{ formTitle }} with E-Mail</h2>
        <div class="email-login-form spread">
          <div class="mr-2">
            <p><b>E-Mail</b></p>
            <input v-model="formEmail" placeholder="email@example.com" />
          </div>
          <v-spacer />
          <div>
            <p><b>Password</b></p>
            <input
              v-model="formPassword"
              type="password"
              placeholder="password"
            />
          </div>
        </div>
        <div v-if="showSignUpForm" class="email-signup-form spread">
          <div class="mr-2">
            <p><b>Name</b></p>
            <input v-model="formName" placeholder="Your Name" />
          </div>
          <v-spacer />
          <div>
            <p><b>Confirm Password</b></p>
            <input
              v-model="formConfirmPassword"
              type="password"
              placeholder="confirm password"
            />
          </div>
        </div>
        <div v-if="signInError !== null">
          <p style="color: red;">
            {{ signInError }}
          </p>
        </div>
        <div class="spread mt-2">
          <v-btn
            v-if="!showSignUpForm"
            class="mr-2"
            :disabled="!signInEnabled"
            color="primary"
            @click.native="emailSignIn"
          >
            Sign In
          </v-btn>
          <v-btn
            v-if="!showSignUpForm"
            color="primary"
            @click.native="emailSignUpShow"
          >
            Sign Up
          </v-btn>
          <v-btn
            v-else
            color="primary"
            :disabled="!signUpEnabled"
            @click.native="emailSignUp"
          >
            Sign Up
          </v-btn>
          <v-spacer />
          <v-btn @click.native="cancelEmailSignIn">
            Cancel
          </v-btn>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<style>
h2.title {
  text-align: center;
}

div.spread {
  display: flex;
}

div.spread input {
  border-style: inset;
}

div.spread p {
  margin-bottom: 0px;
}
</style>

<script>
export default {
  data() {
    return {
      formEmail: '',
      formPassword: '',
      formConfirmPassword: '',
      formName: '',
      showLoginButtons: true,
      showEmailLoginForm: false,
      showSignUpForm: false,
      signInError: null
    }
  },
  computed: {
    signInEnabled() {
      return this.formEmail !== '' && this.formPassword !== ''
    },
    signUpEnabled() {
      return (
        this.showSignUpForm === false ||
        (this.formName !== '' &&
          this.formPassword !== '' &&
          this.formEmail !== '' &&
          this.formConfirmPassword === this.formPassword)
      )
    },
    formTitle() {
      if (this.showSignUpForm) {
        return 'Sign Up'
      } else {
        return 'Sign In'
      }
    }
  },
  methods: {
    showEmailForm() {
      this.showLoginButtons = false
      this.showEmailLoginForm = true
      this.showSignUpForm = false
    },
    cancelEmailSignIn() {
      this.formEmail = ''
      this.formPassword = ''
      this.formConfirmPassword = ''
      this.formName = ''
      this.showLoginButtons = true
      this.showEmailLoginForm = false
      this.showSignUpForm = false
    },
    emailSignIn() {
      const log = this.$log
      this.signInError = null
      this.$store
        .dispatch('signInWithEmail', {
          email: this.formEmail,
          password: this.formPassword
        })
        .then(() => {
          this.cancelEmailSignIn()
        })
        .catch(e => {
          log.error('E-mail sign-in failed', e)
          if (e.code === 'auth/user-not-found') {
            this.signInError =
              'No user with this e-mail exists - sign up to create an account'
          } else if (e.code === 'auth/wrong-password') {
            this.signInError = 'Incorrect password'
          } else if (e.code === 'auth/invalid-email') {
            this.signInError = 'Invalid e-mail address'
          } else if (e.code === 'auth/user-disabled') {
            this.signInError = 'User account is disabled'
          } else {
            this.signInError = 'Unable to sign in at this time'
          }
        })
    },
    emailSignUp() {
      const log = this.$log
      this.signInError = null
      this.$store
        .dispatch('signUpWithEmail', {
          email: this.formEmail,
          password: this.formPassword,
          name: this.formName
        })
        .then(() => {
          this.cancelEmailSignIn()
        })
        .catch(e => {
          log.error('Email sign-up failed', e)
          if (e.code === 'auth/weak-password') {
            this.signInError = 'Password too short / weak'
          } else if (e.code === 'auth/email-already-in-use') {
            this.signInError = 'Email already in use - try signing in'
          } else if (e.code === 'auth/invalid-email') {
            this.signInError = 'Invalid e-mail address'
          } else if (e.code === 'auth/operation-not-allowed') {
            this.signInError = 'Unable to create email/password account'
          } else {
            this.signInError = 'Unable to sign up at this time'
          }
        })
    },
    emailSignUpShow() {
      this.showSignUpForm = true
    },
    googleSignUp() {
      const log = this.$log
      this.$store
        .dispatch('signInWithGoogle')
        .then(result => {
          log.debug('inside then statement on login')
          log.debug('result: ', result)
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
