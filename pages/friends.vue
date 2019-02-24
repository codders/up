<template>
  <v-layout column align-center justify-center>
    <v-card>
      <v-card-title class="headline">
        Your Friends 
      </v-card-title>
      <v-card-text>
        <template v-if="friendCount > 0">
          <v-flex xs12 md4>
            <v-list jest="friends-list">
              <v-list-tile v-for="(friend, key) in friends" :key="key" class="friend">
                <nuxt-link :to="'/friends/' + key">
                  <v-list-tile-title>{{ friend.name }}</v-list-tile-title>
                </nuxt-link>
                <v-spacer />
                <v-list-tile-action @click="deleteFriend(key)">
                  <v-btn icon>
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-flex>
          <v-spacer />
        </template>
        <template v-else>
          <p>No friends yet? Why not add one!</p>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          flat
          nuxt
          to="/add-friend"
        >
          Add Friend 
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  computed: {
    friends() {
      return this.$store.state.friends.data
    },
    friendCount() {
      let count = 0
      // eslint-disable-next-line no-unused-vars
      for (const friend in this.$store.state.friends.data) {
        count += 1
      }
      return count
    }
  },
  methods: {
    deleteFriend(key) {
      this.$log.debug('Deleting friend with key: ', key)
      this.$store.dispatch('friends/delete', key)
    }
  }
}
</script>

<style>
.avatar {
  max-width: 100px;
}
.avatar img {
  max-width: 100%;
}
</style>
