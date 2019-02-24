<template>
  <v-layout>
    <v-flex text-xs-center>
      <v-layout row wrap>
        <form jest="add-friend-form">
          <v-flex xs12>
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
      this.$store.dispatch('addFriend', {
        name: this.name,
        email: this.email
      })
      return this.$nuxt.$router.replace({ path: '/friends' })
    }
  }
}
</script>
