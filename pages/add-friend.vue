<template>
  <v-layout>
    <v-flex text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <h1>The Directory</h1>
          <v-list jest="directory-listing">
            <directory-entry
              v-for="entry in $data.directoryEntries"
              :key="entry.uid"
              :name="entry.name"
              :uid="entry.uid"
            />
          </v-list>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import DirectoryEntry from '@/components/DirectoryEntry'

export default {
  components: {
    DirectoryEntry
  },
  data() {
    return {
      directoryEntries: []
    }
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
  }
}
</script>
