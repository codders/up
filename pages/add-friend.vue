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
        <form>
          <v-flex xs12 md6>
            <p>
              Name:
              <v-text-field
                id="name"
                v-model.trim="name"
                v-validate="'required'"
                name="name"
                label="Enter your friend's name"
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
export default {
  data() {
    return {
      name: '',
      email: ''
    }
  },
  methods: {
    submitAddFriend() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.addFriend()
        }
      })
    },
    addFriend() {
      this.profileRef
        .set({
          name: this.name,
          email: this.email
        })
        .then(() => {
          this.$nuxt.$router.replace({ path: '/' })
        })
    }
  }
}
</script>
