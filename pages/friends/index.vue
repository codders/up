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
              <v-list-item
                v-for="(friend, index) in friends"
                :key="index"
                class="friend"
              >
                <nuxt-link :to="'/friends/' + friend.uid">
                  <v-list-item-title class="name">
                    {{ friend.name }}
                  </v-list-item-title>
                </nuxt-link>
                <v-spacer />
                <v-list-item-action @click="deleteFriend(friend.uid)">
                  <v-btn icon>
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-flex>
          <v-spacer />
        </template>
        <template v-else>
          <p>No friends yet? Why not add one!</p>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text nuxt to="/">
          Go Back
        </v-btn>
        <v-spacer />
        <v-btn color="primary" text nuxt to="/add-friend">
          Add Friend
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  async fetch({ store, params }) {
    await store.dispatch('loadFriends')
  },
  computed: {
    friends() {
      return this.$store.getters.friends
    },
    friendCount() {
      if (this.$store.getters.friends !== undefined) {
        return this.$store.getters.friends.length
      } else {
        return 0
      }
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
