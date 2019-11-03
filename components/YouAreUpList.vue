<template>
  <div v-if="youreUp.length === 0" jest="nothing-up">
    <p>You are not up right now</p>
  </div>
  <div v-else jest="something-up">
    <h2>Here are your current requests...</h2>
    <v-flex xs12 md4>
      <v-list jest="you-are-up-list">
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
</template>

<script>
import YouAreUp from '~/components/YouAreUp.vue'

export default {
  components: {
    YouAreUp
  },
  computed: {
    youreUp() {
      const whatsUp = this.$store.getters.whatsUp
      if (this.$store.getters.activeUser == null) {
        return []
      }
      return whatsUp.filter(
        item => item.uid === this.$store.getters.activeUser.uid
      )
    }
  },
  mounted: function() {
    const vm = this
    this.$axios
      .$get('https://europe-west1-up-now-a6da8.cloudfunctions.net/app/myUp', {
        headers: {
          Authorization: 'Bearer ' + this.$store.state.idToken
        }
      })
      .then(response => {
        vm.$store.commit('mergeWhatsUpRecords', response)
      })
      .catch(error => {
        vm.$log.error('Unable to load my up data', error)
      })
  }
}
</script>
