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
          <v-btn color="primary" text nuxt @click="$router.go(-1)">
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
  async fetch({ store, params }) {
    await store.dispatch('loadFriends')
  },
  beforeMount() {
    if (this.friend() === undefined) {
      this.$nuxt.$router.replace('/friends/unknown_friend')
    }
  },
  methods: {
    friend() {
      for (const friend of this.$store.getters.friends) {
        if (friend.uid === this.$route.params.id) {
          return friend
        }
      }
      return undefined
    }
  }
}
</script>
