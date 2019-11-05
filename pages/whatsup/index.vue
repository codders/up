<template>
  <v-layout column align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          What's Up right now
        </v-card-title>
        <v-card-text>
          <whats-up-list />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text nuxt to="/">
            Go Back
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <nuxt-child />
  </v-layout>
</template>

<script>
import WhatsUpList from '~/components/WhatsUpList.vue'

export default {
  components: {
    WhatsUpList
  }
}
</script>
