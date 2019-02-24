<template>
  <section class="">
    <v-layout row wrap>
      <v-card>
        <v-card-title class="headline">
          {{ $route.params.activity }} {{ $route.params.time }}
        </v-card-title>
        <v-card-text>
          <v-flex xs12 sm12>
            <h2>
              Show up?
            </h2>
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            flat
            nuxt
            to="/"
          >
            No...
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            nuxt
            to="/"
          >
            Yes!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
  </section>
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
      this.$nuxt.$router.replace({ path: '/up/' + time.title })
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
