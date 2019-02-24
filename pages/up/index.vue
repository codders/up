<template>
  <section class="">
    <v-layout row wrap>
      <v-card>
        <v-card-title class="headline">
          What do you want to do?
        </v-card-title>
        <v-card-text>
          <v-flex xs12 sm12>
            <v-list two-line jest="activities-list">
              <v-list-tile v-for="(activity, key) in activities" :key="key" class="activity" @click="selectActivity(activity)">
                <v-list-tile-content>
                  <v-list-tile-title>{{ activity.title }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ activity.description }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
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
    </v-layout>
    <nuxt-child />
  </section>
</template>

<script>
export default {
  computed: {
    activities() {
      return [
        {
          title: 'Move',
          description: 'Dance, run, do sport'
        },
        {
          title: 'Relax',
          description: 'Hang out, cuddle, massage, sleep'
        },
        {
          title: 'Eat',
          description: 'Go have dinner somewhere'
        },
        {
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
