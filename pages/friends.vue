<template>
  <section class="">
    <v-layout row wrap>
      <template v-if="friendsCount > 0">
        <v-flex xs12 md4>
          <h2>Your Friends</h2>
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
    </v-layout>
  </section>
</template>

<script>
import DataModel from '@/models/data.js'

export default {
  data() {
    return {
      friends: [],
      friendsCount: 0
    }
  },
  async asyncData({ store }) {
    const friends = []
    await DataModel.userFriends(store.getters.activeUser.uid)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(friend) {
          friends.push(friend)
        })
      })
    return { friends: friends, friendsCount: friends.length }
  },
  methods: {
    deleteFriend(key) {}
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
