<template>
  <v-layout column align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-card v-if="friend() !== undefined">
        <v-card-title class="headline" jest="friend-name">
          <p>{{ friend().name }}</p>
        </v-card-title>
        <v-card-text>
          <v-row class="mb-4" align="center" justify="center">
            <v-img
              v-if="friend().photoURL !== undefined"
              :src="friend().photoURL"
              width="80"
              height="80"
              max-width="80"
            />
          </v-row>
          <h3>Notification subscriptions for {{ friend().name }}</h3>
          <v-list two-line jest="activities-list">
            <v-list-item
              v-for="(activity, key) in activities"
              :key="key"
              class="activity"
              @click="selectActivity(activity)"
            >
              <v-list-item-avatar>
                <v-icon>{{ activity.icon }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ activity.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ activity.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-checkbox v-model="selected[activity.id]" @click.prevent="" />
              </v-list-item-action>
            </v-list-item>
          </v-list>
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
import activitiesList from '@/model/activity.js'

export default {
  async fetch({ store, params }) {
    await store.dispatch('loadFriends')
  },
  data() {
    const friend = this.$store.getters.friends.find(
      (item) => item.uid === this.$route.params.id
    )
    if (friend === undefined) {
      return { selected: [] }
    }
    const selected = {}
    for (const activity of activitiesList) {
      let selectVal = true
      if (friend.subscription !== undefined) {
        if (friend.subscription[activity.id] !== undefined) {
          selectVal = friend.subscription[activity.id]
        }
      }
      selected[activity.id] = selectVal
    }
    return { selected }
  },
  computed: {
    activities() {
      return activitiesList
    },
  },
  beforeMount() {
    if (this.friend() === undefined) {
      this.$nuxt.$router.replace('/friends/unknown_friend')
    }
  },
  methods: {
    selectActivity(activity) {
      this.$log.debug('Selected: ' + activity.title)
      this.selected[activity.id] = !this.selected[activity.id]
      this.$store.dispatch('updateFriendNotificationSubscription', {
        uid: this.friend().uid,
        activity: activity.id,
        subscribe: this.selected[activity.id],
      })
    },
    friend() {
      for (const friend of this.$store.getters.friends) {
        if (friend.uid === this.$route.params.id) {
          return friend
        }
      }
      return undefined
    },
  },
}
</script>
