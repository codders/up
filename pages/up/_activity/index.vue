<template>
  <v-layout column align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          When do you want to?
        </v-card-title>
        <v-card-text>
          <v-list jest="times-list">
            <v-list-tile v-for="(time, key) in times" :key="key" class="time" @click="selectTime(time)">
              <v-list-tile-content>
                <v-list-tile-title>{{ time.title }}</v-list-tile-title>
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
            to="/up"
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
    times() {
      return [
        {
          title: 'Now'
        },
        {
          title: '1h'
        },
        {
          title: '2h'
        },
        {
          title: '4h'
        },
        {
          title: 'Tonight'
        }
      ]
    }
  },
  methods: {
    selectTime(time) {
      this.$log.debug('Selected: ' + time.title)
      this.$nuxt.$router.replace({
        path: '/up/' + this.$route.params.activity + '/' + time.title
      })
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
