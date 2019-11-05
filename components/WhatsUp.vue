<template>
  <v-list-item class="up">
    <v-list-item-content @click="routeToItem(whatsupid)">
      <v-list-item-title>
        {{ name }} wants to
        {{ getTitleForActivity(activity) }}
      </v-list-item-title>
      <v-list-item-subtitle v-if="!isEmpty(description)">
        {{ description }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action
      v-if="isUp"
      class="delete_action"
      @click="$emit('cancelUp')"
    >
      <v-btn icon>
        <v-icon>remove_circle</v-icon>
      </v-btn>
    </v-list-item-action>
    <v-list-item-action v-else class="add_action" @click="$emit('showUp')">
      <v-btn icon>
        <v-icon>add_circle</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<style>
div.v-list-item__content {
  cursor: pointer;
}
</style>

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
    },
    whatsupid: {
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
    routeToItem(id) {
      this.$nuxt.$router.push({
        name: 'whatsup-id',
        params: { id }
      })
    }
  }
}
</script>
