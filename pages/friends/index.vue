<template>
  <v-layout column align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          Your Friends
        </v-card-title>
        <v-card-text>
          <template v-if="friendCount > 0">
            <v-list jest="friends-list">
              <v-list-item
                v-for="(friend, index) in friends"
                :key="index"
                class="friend"
                @click="routeToFriend(friend)"
              >
                <v-list-item-avatar>
                  <v-img :src="friend.photoURL" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="name">
                    {{ friend.name }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action @click.stop="deleteFriend(friend.uid)">
                  <v-btn icon>
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-spacer />
          </template>
          <template v-else>
            <p>No friends yet? Why not add one!</p>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text nuxt @click="$router.go(-1)">
            Go Back
          </v-btn>
          <v-spacer />
          <v-btn color="primary" rounded nuxt @click="goAddFriend()">
            Add Friend
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { sortFriends } from '@/model/friends'

export default {
  async fetch({ store }) {
    await store.dispatch('loadFriends')
  },
  computed: {
    friends() {
      return sortFriends(this.$store.getters.friends)
    },
    friendCount() {
      if (this.$store.getters.friends !== undefined) {
        return this.$store.getters.friends.length
      } else {
        return 0
      }
    },
  },
  methods: {
    goAddFriend() {
      this.$nuxt.$router.push({
        name: 'add-friend',
      })
    },
    deleteFriend(key) {
      this.$log.debug('Deleting friend with key: ', key)
      this.$store.dispatch('deleteFriend', key)
    },
    routeToFriend(friend) {
      this.$nuxt.$router.push({
        name: 'friends-id',
        params: { id: friend.uid },
      })
    },
  },
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
