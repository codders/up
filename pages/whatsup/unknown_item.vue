<template>
  <v-layout column align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          Unknown Item
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text nuxt @click="$router.go(-1)">
            Go Back
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <nuxt-child />
  </v-layout>
</template>
