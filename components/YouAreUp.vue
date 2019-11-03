<template>
  <v-list-item class="youre-up">
    <v-list-item-content>
      <v-list-item-title class="activity">
        Showing up to {{ getTitleForActivity(activity) }}
        <span v-if="!isEmpty(description)">: "{{ description }}"</span>
      </v-list-item-title>
      <v-list-item-subtitle class="accepted">
        {{ getFriendsListAsText(acceptedFriends) }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action @click="cancelUpRequest(id)">
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
      }
    },
    acceptedFriends: {
      type: Array,
      default: () => {
        return []
      }
    },
    description: {
      type: String,
      default: undefined
    },
    id: {
      type: String,
      default: undefined
    }
  },
  methods: {
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
        return 'Nobody replied yet...'
      }
    },
    cancelUpRequest(id) {
      this.$log.debug('Cancelling up request: ' + id)
      this.$axios({
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + this.$store.state.idToken,
          'Content-Type': 'application/json'
        },
        url: 'https://europe-west1-up-now-a6da8.cloudfunctions.net/app/up/' + id
      })
        .then(response => {
          this.$log.debug('Delete completed, removing element')
          this.$store.commit('deleteWhatsUp', id)
        })
        .catch(error => {
          this.$log.error('Delete failed, not removing element', error)
        })
    }
  }
}
</script>
