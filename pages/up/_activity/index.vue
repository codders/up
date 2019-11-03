<template>
  <v-layout column align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          {{ activityName() }}
        </v-card-title>
        <v-card-text>
          <h3>with these friends</h3>
          <v-list jest="friends-list">
            <v-list-item
              v-for="(friend, key) in knownFriends"
              :key="key"
              class="friend"
              @click="selectFriend(friend)"
            >
              <v-list-item-title class="name">
                {{ friend.name }}
              </v-list-item-title>
              <v-list-item-action>
                <v-checkbox v-model="selected[friend.uid]" @click.prevent="" />
              </v-list-item-action>
              <v-spacer />
            </v-list-item>
          </v-list>
          <h3>Provide some details (optional)</h3>
          <textarea
            v-model="description"
            style="color: black; background-color: white"
          />
          <h2>
            Show up?
          </h2>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text nuxt to="/">
            No...
          </v-btn>
          <v-spacer />
          <v-btn color="primary" text nuxt @click="showUp()">
            Yes!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { activityArrayToString } from '@/model/activity'
import { loadDirectoryFriends, filterKnownFriends } from '@/model/friends'

export default {
  data: () => ({
    selected: {},
    directoryFriends: [],
    description: ''
  }),
  computed: {
    friends() {
      return this.$store.getters.friends
    },
    knownFriends() {
      return filterKnownFriends(this.friends, this.directoryFriends)
    }
  },
  asyncData({ $axios, store }) {
    return loadDirectoryFriends($axios, store)
      .then(function(data) {
        const selected = {}
        for (const friend in data.directoryFriends) {
          selected[data.directoryFriends[friend].uid] = true
        }
        return Object.assign(data, { selected })
      })
      .catch(function(error) {
        return {
          selected: {},
          directoryFriends: [],
          error
        }
      })
  },
  methods: {
    activityName() {
      return activityArrayToString(this.$route.params.activity.split('-'))
    },
    selectFriend(friend) {
      this.selected[friend.uid] = !this.selected[friend.uid]
    },
    showUp() {
      const selectedFriends = []
      const vm = this
      Object.keys(this.$data.selected).map(function(friendId) {
        if (vm.$data.selected[friendId]) {
          selectedFriends.push(friendId)
        }
      })
      this.$log.debug(
        'Showing Up for ' + this.$route.params.activity + ' with',
        this.$data.selected
      )
      this.$axios({
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + this.$store.state.idToken
        },
        data: {
          activity: this.$route.params.activity.split('-'),
          description: this.$data.description,
          friends: selectedFriends
        },
        url:
          'https://europe-west1-up-now-a6da8.cloudfunctions.net/app/saveRecord'
      }).then(this.$nuxt.$router.replace({ path: '/' }))
    }
  }
}
</script>
