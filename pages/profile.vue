<template>
  <v-layout column align-center justify-center>
    <v-card>
      <v-card-title class="headline">
        Your Profile
      </v-card-title>
      <v-card-text>
        <p><b>Name:</b></p>
        <input v-model="name" jest="name" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text nuxt @click="$router.go(-1)">
          Go Back
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<style>
div.v-card div input {
  border-style: solid;
}
</style>

<script>
export default {
  computed: {
    name: {
      get() {
        return this.$store.state.profile.data.name
      },
      set(value) {
        this.$store.dispatch('profile/patch', { name: value })
      }
    }
  }
}
</script>
