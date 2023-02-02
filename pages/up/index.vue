<template>
  <v-layout column align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          What do you want to do?
        </v-card-title>
        <v-card-text>
          <v-list two-line jest="activities-list">
            <v-list-item
              v-for="(activity, key) in activities"
              :key="key"
              class="activity"
              @click="selectActivity(activity)"
            >
              <v-list-item-avatar>
                <v-icon>{{ activity.icon }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ activity.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ activity.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-checkbox v-model="selected[activity.id]" @click="selectActivity(activity)" />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text nuxt @click="$router.go(-1)">
            Go Back
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            :disabled="!selectFriendEnabled"
            rounded
            nuxt
            @click="selectFriends()"
          >
            Select Friends
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <nuxt-child />
  </v-layout>
</template>

<script>
import activitiesList from '@/model/activity.js'

export default {
  data: () => {
    const selected = {}
    for (const id in activitiesList) {
      selected[activitiesList[id].id] = false
    }
    return { selected }
  },
  computed: {
    activities() {
      return activitiesList
    },
    selectFriendEnabled() {
      return this.activityArray().length > 0
    },
  },
  methods: {
    selectFriends() {
      if (this.activityArray() !== '') {
        this.$nuxt.$router.push({
          name: 'up-activity',
          params: { activity: this.activityArray() },
        })
      }
    },
    selectActivity(activity) {
      this.$log.debug('Selected: ' + activity.title)
      this.selected[activity.id] = !this.selected[activity.id]
    },
    activityArray() {
      const selectedActivities = []
      const vm = this
      Object.keys(this.selected).map(function (key, index) {
        if (vm.selected[key]) {
          selectedActivities.push(key)
        }
      })
      return selectedActivities.join('-')
    },
  },
}
</script>

<style>
.avatar {
  max-width: 100px;
}
.avatar img {
  max-width: 100%;
}
</style>
