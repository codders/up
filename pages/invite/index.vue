<template>
  <v-layout column align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline"> Invitations </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  beforeMount() {
    if (this.$nuxt.$route.query.key !== undefined) {
      this.$nuxt.$router.replace(`/invite/${this.$nuxt.$route.query.key}`)
    } else {
      this.$nuxt.$router.replace('/')
    }
  },
}
</script>
