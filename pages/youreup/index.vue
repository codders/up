<template>
  <v-layout column align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          What you're up for
        </v-card-title>
        <v-card-text>
          <you-are-up-list />
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
import YouAreUpList from '~/components/YouAreUpList.vue'

export default {
  components: {
    YouAreUpList
  }
}
</script>
