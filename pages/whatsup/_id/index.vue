<template>
  <v-layout column align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-card jest="whats-up-item">
        <v-card-title class="headline">
          Whats Up Invitation
        </v-card-title>
        <v-card-text v-if="whatsUpItem() !== undefined">
          <h1>{{ whatsUpItem().name }}</h1>
          <h3>wants to {{ getTitleForActivity(whatsUpItem()) }}</h3>
          <p v-if="whatsUpItem().description !== undefined">
            {{ whatsUpItem().description }}
          </p>
          <p>Received at {{ getTime() }}</p>
          <div v-if="whatsUpItem().isUp !== true">
            <p>You have not yet accepted this invitation</p>
            <v-btn color="primary" rounded @click="showUp(whatsUpItem().id)">
              Accept Invitation
            </v-btn>
          </div>
          <div v-else>
            <p>You have accepted this invitation</p>
            <v-btn
              color="secondary"
              rounded
              @click="cancelUp(whatsUpItem().id)"
            >
              Cancel
            </v-btn>
          </div>
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
import { activityArrayToString } from '@/model/activity'

export default {
  beforeMount() {
    if (this.whatsUpItem() === undefined) {
      this.$nuxt.$router.replace('/whatsup/unknown_item')
    }
  },
  methods: {
    whatsUpItem() {
      return this.$store.getters.whatsUp.find(
        item => item.id === this.$route.params.id
      )
    },
    getTime() {
      const date = new Date(this.whatsUpItem().timestamp._seconds * 1000)
      return date.getHours() + 'h' + (date.getMinutes() + '').padStart(2, '0')
    },
    getTitleForActivity(item) {
      return activityArrayToString(item.activity)
    },
    showUp(id) {
      this.$store.dispatch('changeUp', { id, isUp: true })
    },
    cancelUp(id) {
      this.$store.dispatch('changeUp', { id, isUp: false })
    }
  }
}
</script>
