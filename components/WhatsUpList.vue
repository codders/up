<template>
  <div jest="top-level-list">
    <pulse-loader :loading="loading" color="#b3d4fc"></pulse-loader>
    <div v-if="!loading">
      <div
        v-if="whatsUp.length === 0 && youreUp.length === 0"
        jest="nothing-up"
      >
        <p>Nothing's happening right now... Be the first to show up!</p>
      </div>
      <div v-if="whatsUp.length > 0" jest="something-up">
        <h3>Here's what's up right now...</h3>
        <v-list two-line>
          <whats-up
            v-for="invitation in whatsUp"
            :key="invitation.id"
            :whatsupid="invitation.id"
            :uid="invitation.uid"
            :name="invitation.name"
            :activity="invitation.activity"
            :description="invitation.description"
            :is-up="invitation.isUp"
            :timestamp="invitation.timestamp._seconds"
            @showUp="showUp(invitation.id)"
            @cancelUp="cancelUp(invitation.id)"
          />
        </v-list>
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
import WhatsUp from '~/components/WhatsUp.vue'

export default {
  components: {
    WhatsUp,
    PulseLoader
  },
  data() {
    return { loading: false }
  },
  computed: {
    whatsUp() {
      const whatsUpData = this.$store.getters.whatsUp
      if (this.$store.getters.activeUser == null) {
        return []
      }
      return whatsUpData.filter(
        item => item.uid !== this.$store.getters.activeUser.uid
      )
    },
    youreUp() {
      const whatsUpData = this.$store.getters.whatsUp
      if (this.$store.getters.activeUser == null) {
        return []
      }
      return whatsUpData.filter(
        item => item.uid === this.$store.getters.activeUser.uid
      )
    }
  },
  mounted() {
    const vm = this
    this.loading = true
    this.$axios
      .$get(
        'https://europe-west1-up-now-a6da8.cloudfunctions.net/app/whatsUp',
        {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.idToken
          }
        }
      )
      .then(response => {
        vm.$store.commit('mergeWhatsUpRecords', response)
        vm.loading = false
      })
      .catch(error => {
        vm.$log.error('Unable to load whatsapp data', error)
        vm.loading = false
      })
  },
  methods: {
    showUp(id) {
      this.$store.dispatch('changeUp', { id, isUp: true })
    },
    cancelUp(id) {
      this.$store.dispatch('changeUp', { id, isUp: false })
    }
  }
}
</script>
