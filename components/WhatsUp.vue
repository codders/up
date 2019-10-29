<template>
  <v-list-tile class="up">
    <v-list-tile-content>
      <v-list-tile-title>{{ name }} wants to {{ getTitleForActivity(activity) }}</v-list-tile-title>
      <v-list-tile-sub-title v-if="!isEmpty(description)">
        {{ description }}
      </v-list-tile-sub-title>
    </v-list-tile-content>
    <v-list-tile-action v-if="isUp" class="delete_action" @click="$emit('cancelUp')">
      <v-btn icon>
        <v-icon>remove_circle</v-icon>
      </v-btn>
    </v-list-tile-action>
    <v-list-tile-action v-else class="add_action" @click="$emit('showUp')">
      <v-btn icon>
        <v-icon>add_circle</v-icon>
      </v-btn>
    </v-list-tile-action>
  </v-list-tile>
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
    },
    isUp: {
      type: Boolean,
      default: false
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
