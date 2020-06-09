<template>
  <v-list-item class="youre-up" @click="routeToItem(id)">
    <v-list-item-content>
      <v-list-item-title class="activity">
        Showing up to {{ getTitleForActivity(activity) }}
        <span v-if="!isEmpty(description)">: "{{ description }}"</span>
      </v-list-item-title>
      <v-list-item-subtitle class="accepted">
        {{ getFriendsListAsText(acceptedFriends) }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action @click.stop="cancelUpRequest(id)">
      <v-btn icon>
        <v-icon>delete</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { activityArrayToString } from '@/model/activity'

export default {
  props: {
    activity: {
      type: Array,
      default: () => {
        return []
      },
    },
    acceptedFriends: {
      type: Array,
      default: () => {
        return []
      },
    },
    description: {
      type: String,
      default: undefined,
    },
    id: {
      type: String,
      default: undefined,
    },
  },
  methods: {
    routeToItem(id) {
      this.$nuxt.$router.push({
        name: 'youreup-id',
        params: { id },
      })
    },
    isEmpty(str) {
      return !str || str.length === 0
    },
    getTitleForActivity(ids) {
      return activityArrayToString(ids)
    },
    getFriendsListAsText(friends) {
      if (friends.length > 0) {
        return 'Replies from: ' + friends.join(',')
      } else {
        return 'Waiting for replies...'
      }
    },
    cancelUpRequest(id) {
      this.$store.dispatch('deleteUp', id)
    },
  },
}
</script>
