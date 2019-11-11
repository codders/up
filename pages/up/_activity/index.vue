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
            <v-list-item class="selectall" @click="selectAll()">
              <v-list-item-content>
                [ select all ]
              </v-list-item-content>
              <v-list-item-action>
                <v-checkbox
                  v-model="allSelected"
                  v-bind:indeterminate="someSelected"
                  @click.prevent=""
                />
              </v-list-item-action>
            </v-list-item>
            <v-list-item
              v-for="(friend, index) in friends"
              :key="index"
              class="friend"
              @click="selectFriend(friend)"
            >
              <v-list-item-title class="name">
                {{ friend.name }}
              </v-list-item-title>
              <v-list-item-action>
                <v-checkbox
                  v-model="getSelected()[friend.uid]"
                  @click.prevent=""
                />
              </v-list-item-action>
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
import { sortFriends } from '@/model/friends'

export default {
  async fetch({ store, params }) {
    await store.dispatch('loadFriends')
  },
  data: () => ({
    selected: {},
    description: ''
  }),
  computed: {
    friends() {
      return sortFriends(this.$store.getters.friends)
    },
    someSelected() {
      if (Object.keys(this.selected).length === 0) {
        return false
      } else {
        const firstValue = Object.values(this.selected)[0]
        let same = true
        Object.values(this.selected).forEach(function(value) {
          if (value !== firstValue) {
            same = false
          }
        })
        return !same
      }
    },
    allSelected() {
      if (Object.keys(this.selected).length === 0) {
        return true
      } else {
        let same = true
        Object.values(this.selected).forEach(function(value) {
          if (value !== true) {
            same = false
          }
        })
        return same
      }
    }
  },
  methods: {
    selectAll() {
      const selected = {}
      for (const friend of this.$store.getters.friends) {
        selected[friend.uid] = !this.allSelected
      }
      this.selected = selected
    },
    getSelected() {
      if (Object.keys(this.selected).length === 0) {
        this.selected = this.selectNoFriends()
      }
      return this.selected
    },
    selectNoFriends() {
      const selected = {}
      for (const friend of this.$store.getters.friends) {
        selected[friend.uid] = false
      }
      return selected
    },
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
