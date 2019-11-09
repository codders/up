<template>
  <v-layout>
    <v-flex text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <h1>Add by e-mail address</h1>
          <div>
            <input
              v-model="email"
              placeholder="email@address.com"
              :disabled="!inputEnabled"
            />
            <v-btn
              color="primary"
              :disabled="!inputEnabled"
              @click="addFriendByEmail(email)"
            >
              Add Friend
            </v-btn>
          </div>
          <div v-if="addFriendError !== null">
            <p style="color: red;">
              {{ addFriendError }}
            </p>
          </div>
          <h1>Add from Directory</h1>
          <div v-if="$data.directoryEntries.length > 0">
            <v-list jest="directory-listing">
              <directory-entry
                v-for="entry in $data.directoryEntries"
                :key="entry.uid"
                :name="entry.name"
                :uid="entry.uid"
              />
            </v-list>
          </div>
          <div v-else>
            <p>You can't see anyone in the directory right now</p>
            <p>
              Try adding some friends manually, and your directory will grow
            </p>
          </div>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<style>
div.flex input {
  border-style: solid;
}
</style>

<script>
import DirectoryEntry from '@/components/DirectoryEntry'

export default {
  async fetch({ store, params }) {
    await store.dispatch('loadFriends')
  },
  components: {
    DirectoryEntry
  },
  asyncData({ $axios, store }) {
    return $axios
      .$get(
        'https://europe-west1-up-now-a6da8.cloudfunctions.net/app/directory',
        {
          headers: {
            Authorization: 'Bearer ' + store.state.idToken
          }
        }
      )
      .then(response => {
        return { directoryEntries: response }
      })
      .catch(error => {
        return { directoryEntries: error }
      })
  },
  data() {
    return {
      directoryEntries: [],
      email: '',
      inputEnabled: true,
      addFriendError: null
    }
  },
  methods: {
    addFriendByEmail(email) {
      this.addFriendError = null
      this.inputEnabled = false
      this.$store
        .dispatch('addFriendByEmail', this.email)
        .then(() => {
          this.inputEnabled = true
          this.email = ''
          this.$nuxt.$router.replace('/friends')
        })
        .catch(error => {
          console.log('Error: ', error) // eslint-disable-line no-console
          if (
            error.response.data !== undefined &&
            error.response.data.code === 'NOT_FOUND'
          ) {
            this.addFriendError = 'No user with this e-mail address exists'
          } else {
            this.addFriendError = error.message
          }
          this.inputEnabled = true
        })
    }
  }
}
</script>
