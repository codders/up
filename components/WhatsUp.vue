<template>
  <div class="up">
    <p>{{ getNameForUid(uid) }} wants to {{ getTitleForActivity(activity) }}<span v-if="!isEmpty(description)">: "{{ description }}"</span></p>  
  </div>
</template>

<script>
import { friendNameByUid } from '@/model/friends'
import { getActivityName } from '@/model/activity'

export default {
  props: {
    activity: {
      type: String,
      default: undefined
    },
    uid: {
      type: String,
      default: undefined
    },
    description: {
      type: String,
      default: undefined
    }
  },
  methods: {
    isEmpty(str) {
      return !str || str.length === 0
    },
    getNameForUid(uid) {
      return friendNameByUid(this.$store.getters.friends, uid)
    },
    getTitleForActivity(id) {
      return getActivityName(id)
    }
  }
}
</script>
