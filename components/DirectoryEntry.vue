<template>
  <v-list-item class="entry" @click="routeToFriend(uid)">
    <v-list-item-content @click="routeToFriend(uid)">
      <v-list-item-title>{{ name }}</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action
      v-if="isFriend"
      class="delete_action"
      @click.stop="deleteFriend(uid)"
    >
      <v-btn icon>
        <v-icon>delete</v-icon>
      </v-btn>
    </v-list-item-action>
    <v-list-item-action v-else class="add_action" @click="addFriend(uid, name)">
      <v-btn icon>
        <v-icon>add</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
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
    routeToFriend(uid) {
      if (friendByUid(this.$store.getters.friends, uid) !== undefined) {
        this.$nuxt.$router.push({
          name: 'friends-id',
          params: { id: uid }
        })
      }
    },
    addFriend(uid, name) {
      this.$store.dispatch('addFriend', { uid, name })
    },
    deleteFriend(uid) {
      this.$store.dispatch('deleteFriend', uid)
    }
  }
}
</script>
