<template>
  <div class="up">
    <p>{{ getNameForUid(uid) }} wants to {{ activity }}: "{{ description }}"</p>  
  </div>
</template>

<script>
import { friendNameByUid } from '@/model/friends'

export default {
  props: {
    activity: {
      type: String,
      default: 'activity'
    },
    uid: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },
  methods: {
    getNameForUid(uid) {
      return friendNameByUid(this.$store.getters.friends, uid)
    }
  }
}
</script>
