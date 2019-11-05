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
          <v-btn v-if="whatsUpItem().isUp !== true" color="primary" rounded>
            Accept Invitation
          </v-btn>
          <v-btn v-else color="secondary" rounded>
            Cancel
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
    getTitleForActivity(item) {
      return activityArrayToString(item.activity)
    }
  }
}
</script>
