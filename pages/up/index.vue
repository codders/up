<template>
  <v-layout column align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          What do you want to do?
        </v-card-title>
        <v-card-text>
          <v-list two-line jest="activities-list">
            <v-list-tile v-for="(activity, key) in activities" :key="key" class="activity" @click="selectActivity(activity)">
              <v-list-tile-content>
                <v-list-tile-avatar><v-icon>{{ activity.icon }}</v-icon></v-list-tile-avatar>
                <v-list-tile-title>{{ activity.title }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ activity.description }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            nuxt
            to="/"
          >
            Go Back
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <nuxt-child />
  </v-layout>
</template>

<script>
export default {
  computed: {
    activities() {
      return [
        {
          icon: 'directions_run',
          title: 'Move',
          description: 'Dance, run, do sport'
        },
        {
          icon: 'airline_seat_individual_suite',
          title: 'Relax',
          description: 'Hang out, cuddle, massage, sleep'
        },
        {
          icon: 'local_dining',
          title: 'Eat',
          description: 'Go have dinner somewhere'
        },
        {
          icon: 'whatshot',
          title: 'Play',
          description: 'Seduce, arouse, be intimate'
        }
      ]
    }
  },
  methods: {
    selectActivity(activity) {
      this.$log.debug('Selected: ' + activity.title)
      this.$nuxt.$router.replace({ path: '/up/' + activity.title })
    }
  }
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
