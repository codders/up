<template>
  <div class="youre-up">
    <p>Showing up to {{ getTitleForActivity(activity) }}<span v-if="!isEmpty(description)">: "{{ description }}"</span></p>  
  </div>
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
    description: {
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
    }
  }
}
</script>
