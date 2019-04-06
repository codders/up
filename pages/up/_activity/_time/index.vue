<template>
  <v-layout column align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          {{ activityName() }} {{ timeDescription() }}
        </v-card-title>
        <v-card-text>
          <h3>with these friends</h3>
          <v-list jest="friends-list">
            <v-list-tile v-for="(friend, key) in friends" :key="key" class="friend">
              <v-list-tile-action>
                <v-checkbox v-model="selected" :value="friend.id" multiple />
              </v-list-tile-action>
              <v-list-tile-title>{{ friend.name }}</v-list-tile-title>
              <v-spacer />
            </v-list-tile>
          </v-list>
          <h2>
            Show up?
          </h2>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            flat
            nuxt
            to="/"
          >
            No...
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            nuxt
            @click="showUp()"
          >
            Yes!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { getActivityName } from '@/model/activity.js'
import { getRelativeTimeDescription } from '@/model/time.js'

export default {
  data: () => ({
    selected: []
  }),
  computed: {
    friends() {
      return this.$store.getters.friends
    }
  },
  asyncData({ app, store }) {
    const selected = []
    for (const friend in store.getters.friends) {
      selected.push(friend)
    }
    return { selected: selected }
  },
  methods: {
    activityName() {
      return getActivityName(this.$route.params.activity)
    },
    timeDescription() {
      return getRelativeTimeDescription(this.$route.params.time)
    },
    showUp() {
      this.$log.debug(
        'Showing Up for ' +
          this.$route.params.activity +
          ' in ' +
          this.$route.params.time +
          ' with',
        this.$data.selected
      )
      const friendList = []
      for (const i in this.$data.selected) {
        friendList.push(this.$data.selected[i].replace(/\ufe52/g, '.'))
      }
      this.$axios({
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + this.$store.state.idToken
        },
        data: {
          activity: this.$route.params.activity,
          time: this.$route.params.time,
          friends: friendList
        },
        url:
          'https://europe-west1-up-now-a6da8.cloudfunctions.net/app/saveRecord'
      }).then(this.$nuxt.$router.replace({ path: '/' }))
    }
  }
}
</script>
