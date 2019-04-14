<template>
  <div class="up">
    <p>{{ name }} wants to {{ getTitleForActivity(activity) }}<span v-if="!isEmpty(description)">: "{{ description }}"</span></p>  
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
    name: {
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
    getTitleForActivity(ids) {
      return activityArrayToString(ids)
    }
  }
}
</script>
