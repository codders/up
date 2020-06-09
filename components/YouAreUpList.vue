<template>
  <div>
    <pulse-loader :loading="loading" color="#b3d4fc"></pulse-loader>
    <div v-if="!loading">
      <div v-if="youreUp.length === 0" jest="nothing-up" />
      <div v-else jest="something-up">
        <h3>Here are your current requests...</h3>
        <v-flex>
          <v-list two-line jest="you-are-up-list">
            <you-are-up
              v-for="invitation in youreUp"
              :id="invitation.id"
              :key="invitation.id"
              :activity="invitation.activity"
              :description="invitation.description"
              :accepted-friends="invitation.acceptedFriends"
            />
          </v-list>
        </v-flex>
      </div>
    </div>
  </div>
</template>

<style>
div.v-spinner {
  text-align: center;
}
</style>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import YouAreUp from '~/components/YouAreUp.vue'

export default {
  components: {
    YouAreUp,
    PulseLoader,
  },
  data() {
    return { loading: false }
  },
  computed: {
    youreUp() {
      const whatsUp = this.$store.getters.whatsUp
      if (this.$store.getters.activeUser == null) {
        return []
      }
      return whatsUp.filter(
        (item) => item.uid === this.$store.getters.activeUser.uid
      )
    },
  },
  mounted() {
    const vm = this
    this.loading = true
    this.$axios
      .$get('https://europe-west1-up-now-a6da8.cloudfunctions.net/app/myUp', {
        headers: {
          Authorization: 'Bearer ' + this.$store.state.idToken,
        },
      })
      .then((response) => {
        vm.loading = false
        vm.$store.commit('mergeWhatsUpRecords', response)
      })
      .catch((error) => {
        vm.loading = false
        vm.$log.error('Unable to load my up data', error)
      })
  },
}
</script>
