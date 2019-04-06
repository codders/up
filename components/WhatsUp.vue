<template>
  <div class="up">
    <p>{{ getNameForEmail(email) }} wants to {{ activity }}</p>  
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
    }
  },
  methods: {
    getNameForEmail(email) {
      return friendNameByEmail(this.$store.getters.friends, email)
    }
  }
}
</script>
