<template>
  <div v-if="$data.whatsUp.length === 0" jest="nothing-up">
    <p>Nothing's happening right now... Be the first to show up!</p>
  </div>
  <div v-else jest="something-up">
    <h2>Here's what's up right now...</h2>
    <whats-up
      v-for="invitation in $data.whatsUp"
      :key="invitation.id"
      :uid="invitation.uid"
      :name="invitation.name"
      :activity="invitation.activity"
      :description="invitation.description"
    />
  </div>
</template>

<script>
import WhatsUp from '~/components/WhatsUp.vue'

export default {
  components: {
    WhatsUp
  },
  data() {
    return {
      whatsUp: []
    }
  },
  mounted: function() {
    const vm = this
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
        vm.whatsUp = response
      })
      .catch(error => {
        vm.$log.error('Unable to load whatsapp data', error)
      })
  }
}
</script>
