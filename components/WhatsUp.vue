<template>
  <div class="up">
    <p>{{ getNameForEmail(email) }} wants to {{ activity }}: "{{ description }}"</p>  
  </div>
</template>

<script>
import { friendNameByEmail } from '@/model/friends'

export default {
  props: {
    activity: {
      type: String,
      default: 'activity'
    },
    email: {
      type: String,
      default: 'bob@example.com'
    },
    description: {
      type: String,
      default: ''
    }
  },
  methods: {
    getNameForEmail(email) {
      return friendNameByEmail(this.$store.getters.friends, email)
    }
  }
}
</script>
