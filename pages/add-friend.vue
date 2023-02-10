<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title>
          Add a friend
        </v-card-title>
        <v-card-text>
          <h3>Add by e-mail address</h3>
          <div>
            <input
              v-model="email"
              placeholder="email@address.com"
              :disabled="!inputEnabled"
            />
            <v-btn
              color="primary"
              rounded
              :disabled="!inputEnabled"
              @click="addFriendByEmail()"
            >
              Add Friend
            </v-btn>
          </div>
          <div v-if="showInvite">
            <p>
              This e-mail address does not match an existing user<br />
              Would you like to send an invite to them?
            </p>
            <v-btn
              color="primary"
              rounded
              :disabled="!sendInviteEnabled"
              @click="sendInvite()"
            >
              Send Invite
            </v-btn>
            <v-btn
              color="primary"
              rounded
              :disabled="!sendInviteEnabled"
              @click="editAddress()"
            >
              Edit address
            </v-btn>
          </div>
          <div v-if="addFriendError !== null">
            <p style="color: red;">
              {{ addFriendError }}
            </p>
          </div>
          <h3>Add from Directory</h3>
          <div v-if="sortedFriends.length > 0">
            <v-list jest="directory-listing">
              <directory-entry
                v-for="entry in sortedFriends"
                :key="entry.uid"
                :photo-u-r-l="entry.photoURL"
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
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text nuxt @click="$router.go(-1)">
            Go Back
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import DirectoryEntry from '@/components/DirectoryEntry'
import { sortFriends } from '@/model/friends'
import { API_BASE_URL } from '@/model/api'

export default {
  components: {
    DirectoryEntry,
  },
  asyncData({ $axios, store }) {
    return $axios
      .$get(
        API_BASE_URL + '/directory',
        {
          headers: {
            Authorization: 'Bearer ' + store.state.idToken,
          },
        }
      )
      .then((response) => {
        return { directoryEntries: response }
      })
      .catch((error) => {
        return { directoryEntries: error }
      })
  },
  data() {
    return {
      directoryEntries: [],
      email: '',
      inputEnabled: true,
      showInvite: false,
      sendInviteEnabled: true,
      addFriendError: null,
    }
  },
  async fetch({ store }) {
    await store.dispatch('loadFriends')
  },
  computed: {
    sortedFriends() {
      return sortFriends(this.directoryEntries)
    },
  },
  methods: {
    addFriendByEmail() {
      this.addFriendError = null
      this.inputEnabled = false
      this.$store
        .dispatch('addFriendByEmail', this.email)
        .then(() => {
          this.inputEnabled = true
          this.email = ''
          this.$nuxt.$router.replace('/friends')
        })
        .catch((error) => {
          if (
            error.response.data !== undefined &&
            error.response.data.code === 'NOT_FOUND'
          ) {
            this.showInvite = true
          } else {
            this.addFriendError = error.message
            this.inputEnabled = true
          }
        })
    },
    editAddress() {
      this.showInvite = false
      this.inputEnabled = true
      this.addFriendError = null
    },
    sendInvite() {
      this.sendInviteEnabled = false
      this.$store
        .dispatch('inviteFriendByEmail', this.email)
        .then(() => {
          this.showInvite = false
          this.inputEnabled = true
          this.email = ''
          this.sendInviteEnabled = true
          this.addFriendError = null
        })
        .catch((error) => {
          console.log('Error: ', error) // eslint-disable-line no-console
          this.showInvite = false
          this.sendInviteEnabled = true
          this.inputEnabled = true
          this.addFriendError = null
        })
    },
  },
}
</script>

<style>
div.flex input {
  border-style: solid;
}
</style>