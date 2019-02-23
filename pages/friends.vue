<template>
  <section class="">
    <v-layout row wrap>
      <template v-if="friendCount > 0">
        <v-flex xs12 md4>
          <h2>Your Friends</h2>
          <v-list>
            <v-list-tile v-for="(friend, key) in friends" :key="key">
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
import firebase from '@/services/fireinit.js'

export default {
  data() {
    return {
      friends: {},
      friendsCount: 0
    }
  },
  asyncData({ store }) {
    return {
      friendsRef: firebase
        .firestore()
        .collection('users')
        .doc(store.getters.activeUser.uid)
        .collection('friends')
        .get()
    }
  },
  created() {
    const vm = this
    vm.friendsRef.then(function(snapshot) {
      snapshot.forEach(function(friend) {
        vm.friends.append(friend)
      })
      vm.friendCount = vm.friends.length
    })
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
