<template>
  <v-layout column align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-card jest="youre-up-item">
        <v-card-title class="headline">
          Whats Up Invitation
        </v-card-title>
        <v-card-text v-if="youreUpItem() !== undefined">
          <h1>{{ getTitleForActivity(youreUpItem()) }}</h1>
          <p v-if="youreUpItem().description !== undefined">
            {{ youreUpItem().description }}
          </p>
          <div
            v-if="
              youreUpItem().acceptedFriends === undefined ||
              youreUpItem().acceptedFriends.length === 0
            "
          >
            <p>Nobody has accepted your invitation so far</p>
          </div>
          <div v-else>
            Accepted by
            <ul>
              <li
                v-for="(friend, index) in youreUpItem().acceptedFriends"
                :key="index"
              >
                {{ friend }}
              </li>
            </ul>
          </div>
          <div
            v-if="
              youreUpItem().pendingFriends !== undefined &&
              youreUpItem().pendingFriends.length !== 0
            "
          >
            Replies are still pending from
            <ul>
              <li
                v-for="(friend, index) in youreUpItem().pendingFriends"
                :key="index"
              >
                {{ friend }}
              </li>
            </ul>
          </div>
          <v-btn color="error" rounded @click="deleteUp(youreUpItem().id)">
            Delete
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text nuxt to="/">
            GO BACK
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { activityArrayToString } from '@/model/activity'

export default {
  beforeMount() {
    if (this.youreUpItem() === undefined) {
      this.$nuxt.$router.replace('/youreup/unknown_item')
    }
  },
  methods: {
    youreUpItem() {
      return this.$store.getters.whatsUp.find(
        (item) => item.id === this.$route.params.id
      )
    },
    getTitleForActivity(item) {
      return activityArrayToString(item.activity)
    },
    deleteUp(id) {
      this.$store.dispatch('deleteUp', id)
      this.$nuxt.$router.replace('/')
    },
  },
}
</script>
