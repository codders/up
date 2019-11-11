<template>
  <v-layout column align-center justify-center>
    <v-card>
      <v-card-title class="headline">
        Your Profile
      </v-card-title>
      <v-card-text>
        <p v-if="avatarUrl !== undefined" class="profile-image">
          <img :src="avatarUrl" />
        </p>
        <p>
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

<style>
p.profile-image {
  text-align: center;
}

p.profile-image img {
  width: 6rem;
}

div.v-card div input {
  border-style: inset;
}
</style>

<script>
export default {
  async fetch({ store, params }) {
    await store.dispatch('loadProfile')
  },
  data() {
    return { name: this.$store.state.profile.name }
  },
  computed: {
    avatarUrl() {
      return this.$store.state.profile.photoURL
    },
    emptyName() {
      return this.name.length === 0
    }
  },
  methods: {
    saveProfile() {
      this.$store.dispatch('updateProfile', { name: this.name }).then(() => {
        this.$nuxt.$router.replace('/')
      })
    }
  }
}
</script>
