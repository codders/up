<template>
  <v-layout column align-center justify-center>
    <v-card>
      <v-card-title class="headline">
        Your Profile
      </v-card-title>
      <v-card-text>
        <v-row align="center" justify="center">
          <v-img
            v-if="avatarUrl !== null && avatarUrl !== undefined"
            :src="avatarUrl"
            width="80"
            height="80"
            max-width="80"
          />
        </v-row>
        <p class="name">
          <b>Name:</b>
          <input v-model="name" jest="name" />
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text nuxt @click="$router.go(-1)">
          Go Back
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          rounded
          nuxt
          :disabled="emptyName"
          @click="saveProfile()"
        >
          Save Profile
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  data() {
    return { name: this.$store.state.profile.name }
  },
  async fetch({ store }) {
    await store.dispatch('loadProfile')
  },
  computed: {
    avatarUrl() {
      return this.$store.state.profile.photoURL
    },
    emptyName() {
      return this.name.length === 0
    },
  },
  methods: {
    saveProfile() {
      this.$store.dispatch('updateProfile', { name: this.name }).then(() => {
        this.$nuxt.$router.replace('/')
      })
    },
  },
}
</script>

<style>
p.name {
  padding-top: 1rem;
}

div.v-card div input {
  border-style: inset;
  color: white;
}
</style>