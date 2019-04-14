<template>
  <v-list-tile class="entry">
    <nuxt-link :to="'/friends/' + uid">
      <v-list-tile-title>{{ name }}</v-list-tile-title>
    </nuxt-link>
    <v-spacer />
    <v-list-tile-action v-if="isFriend" class="delete_action" @click="deleteFriend(uid)">
      <v-btn icon>
        <v-icon>delete</v-icon>
      </v-btn>
    </v-list-tile-action>
    <v-list-tile-action v-else class="add_action" @click="addFriend(uid)">
      <v-btn icon>
        <v-icon>add</v-icon>
      </v-btn>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
import { friendByUid } from '@/model/friends'

export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    uid: {
      type: String,
      default: ''
    }
  },
  computed: {
    isFriend() {
      const friend = friendByUid(this.$store.getters.friends, this.uid)
      return friend !== undefined
    }
  },
  methods: {
    addFriend(uid) {
      this.$store.dispatch('addFriend', {
        uid: uid
      })
    },
    deleteFriend(uid) {
      this.$store.dispatch('friends/delete', uid)
    }
  }
}
</script>
