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
            <v-list-tile v-for="(friend, key) in friends" :key="key" class="friend">
              <v-list-tile-action>
                <v-checkbox v-model="selected" :value="friend.id" multiple />
              </v-list-tile-action>
              <v-list-tile-title>{{ friend.name }}</v-list-tile-title>
              <v-spacer />
            </v-list-tile>
          </v-list>
          <h3>Provide some details (optional)</h3>
          <textarea v-model="description" style="color: black; background-color: white" />
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
import { activityArrayToString } from '@/model/activity.js'

export default {
  data: () => ({
    selected: [],
    description: ''
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
      return activityArrayToString(this.$route.params.activity.split('-'))
    },
    showUp() {
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
          friends: this.$data.selected
        },
        url:
          'https://europe-west1-up-now-a6da8.cloudfunctions.net/app/saveRecord'
      }).then(this.$nuxt.$router.replace({ path: '/' }))
    }
  }
}
</script>
