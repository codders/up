<template>
  <v-layout>
    <v-flex text-xs-center>
      <img
        src="/v.png"
        alt="Vuetify.js"
        class="mb-5"
      >
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
      <v-layout row wrap>
        <form jest="add-friend-form">
          <v-flex xs12 md6>
            <p>
              Name:
              <v-text-field
                id="name"
                v-model.trim="name"
                v-validate="'required'"
                name="name"
                label="Enter your friend's name"
                data-name
              />
              <span v-show="errors.has('name')" class="text-danger">{{ errors.first('name') }}</span>
            </p>
            <p>
              E-mail:
              <v-text-field
                id="email"
                v-model.trim="email"
                v-validate="'required|email'"
                name="email"
                label="bob@example.com"
                data-email
              />
              <span v-show="errors.has('email')" class="text-danger">{{ errors.first('email') }}</span>
            </p>
            <v-btn :disabled="errors.any()" @click="submitAddFriend">
              Add Friend
            </v-btn>
          </v-flex>
        </form>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import DataModel from '@/models/data.js'

export default {
  data() {
    return {
      name: '',
      email: ''
    }
  },
  methods: {
    submitAddFriend() {
      return this.$validator.validateAll().then(result => {
        if (result) {
          return this.addFriend()
        } else {
          Promise.rejected()
        }
      })
    },
    addFriend() {
      return DataModel.userFriend(
        this.$store.getters.activeUser.uid,
        this.email
      )
        .set({
          name: this.name
        })
        .then(() => {
          this.$nuxt.$router.replace({ path: '/' })
        })
    }
  }
}
</script>
