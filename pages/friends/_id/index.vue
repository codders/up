<template>
  <v-layout column align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-card v-if="friend() !== undefined">
        <v-card-title class="headline" jest="friend-name">
          <p>{{ friend().name }}</p>
        </v-card-title>
        <v-card-text>
          <ul>
            <li>Play</li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text nuxt to="/">
            Go Back
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  beforeMount() {
    if (this.friend() === undefined) {
      this.$nuxt.$router.replace('/friends/unknown_friend')
    }
  },
  methods: {
    friend() {
      for (const [key, value] of Object.entries(this.$store.getters.friends)) {
        if (key === this.$route.params.id) {
          return value
        }
      }
      return undefined
    }
  }
}
</script>
