<template>
  <div v-if="$data.youreUp.length === 0" jest="nothing-up">
    <p>You are not up right now</p>
  </div>
  <div v-else jest="something-up">
    <h2>Here are your current requests...</h2>
    <v-flex xs12 md4>
      <v-list jest="you-are-up-list">
        <you-are-up
          v-for="invitation in $data.youreUp"
          :id="invitation.id"
          :key="invitation.id"
          :activity="invitation.activity"
          :description="invitation.description"
          @delete="deleteUp(invitation.id)"
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
  data() {
    return {
      youreUp: []
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
        vm.youreUp = response
      })
      .catch(error => {
        vm.$log.error('Unable to load my up data', error)
      })
  },
  methods: {
    deleteUp(id) {
      this.youreUp = this.youreUp.filter(upRecord => upRecord.id !== id)
    }
  }
}
</script>
