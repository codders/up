<template>
  <div v-if="$data.whatsUp.length === 0" jest="nothing-up">
    <p>Nothing's happening right now... Be the first to show up!</p>
  </div>
  <div v-else jest="something-up">
    <h2>Here's what's up right now...</h2>
    <v-list two-line>
      <whats-up
        v-for="invitation in $data.whatsUp"
        :key="invitation.id"
        :uid="invitation.uid"
        :name="invitation.name"
        :activity="invitation.activity"
        :description="invitation.description"
        :is-up="invitation.isUp"
        @showUp="showUp(invitation.id)"
        @cancelUp="cancelUp(invitation.id)"
      />
    </v-list>
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
  },
  methods: {
    changeUp(id, isUp) {
      const vm = this
      this.$axios({
        method: 'post',
        url:
          'https://europe-west1-up-now-a6da8.cloudfunctions.net/app/up/' + id,
        data: {
          isUp: isUp
        },
        headers: {
          Authorization: 'Bearer ' + this.$store.state.idToken
        }
      })
        .then(response => {
          const newUps = response.data
          newUps.forEach(function(newUpItem, index) {
            let upIndex = null
            vm.whatsUp.forEach(function(whatsUpItem, index) {
              if (whatsUpItem.id === newUpItem.id) {
                upIndex = index
              }
            })
            vm.whatsUp.splice(upIndex, 1, newUpItem)
          })
        })
        .catch(error => {
          vm.$log.error('Unable to respond to up id ' + id, error)
        })
    },
    showUp(id) {
      console.log('Showing up', id) // eslint-disable-line no-console
      this.changeUp(id, true)
    },
    cancelUp(id) {
      console.log('Cancelling up', id) // eslint-disable-line no-console
      this.changeUp(id, false)
    }
  }
}
</script>
