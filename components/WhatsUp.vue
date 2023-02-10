<template>
  <v-list-item class="up" @click="routeToItem(whatsupid)">
    <v-list-item-content>
      <v-list-item-title>
        {{ getTime }} - {{ name }} wants to
        {{ getTitleForActivity(activity) }}
      </v-list-item-title>
      <v-list-item-subtitle v-if="!isEmpty(description)">
        {{ description }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action
      v-if="isUp"
      class="delete_action"
      @click.stop="$emit('cancelUp')"
    >
      <v-btn icon>
        <v-icon>remove_circle</v-icon>
      </v-btn>
    </v-list-item-action>
    <v-list-item-action v-else class="add_action" @click.stop="$emit('showUp')">
      <v-btn icon>
        <v-icon>add_circle</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { activityArrayToString } from '@/model/activity'

export default {
  props: {
    activity: {
      type: Array,
      default: () => {
        return []
      },
    },
    name: {
      type: String,
      default: undefined,
    },
    uid: {
      type: String,
      default: undefined,
    },
    description: {
      type: String,
      default: undefined,
    },
    isUp: {
      type: Boolean,
      default: false,
    },
    whatsupid: {
      type: String,
      default: undefined,
    },
    timestamp: {
      type: Number,
      default: undefined,
    },
  },
  computed: {
    getTime() {
      const dtFormat = new Intl.DateTimeFormat('en-GB', {
        timeStyle: 'short',
        timeZone: 'Europe/Berlin'
      })
      try {
        return dtFormat.format(this.timestamp * 1000).replace(':', 'h')
      } catch (err) {
        return this.timestamp
      }
    },
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
        params: { id },
      })
    },
  },
}
</script>
