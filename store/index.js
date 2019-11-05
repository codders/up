/** Vuex-Easy-Firestore config **/
import createEasyFirestore from 'vuex-easy-firestore'
import axios from 'axios'

import { auth, GoogleProvider } from '@/services/fireinit.js'

/* Friends firestore */
const friends = {
  firestorePath: 'users/{userId}/friends',
  firestoreRefType: 'collection',
  moduleName: 'friends',
  statePropName: 'data',
  namespaced: true
}
const easyFriendsFirestore = createEasyFirestore(friends, { logging: true })

/* Profile firestore */
const profile = {
  firestorePath: 'users/{userId}',
  firestoreRefType: 'document',
  moduleName: 'profile',
  statePropName: 'data',
  namespaced: true,
  serverChange: {
    modifiedHook(updateStore, doc, id, store, source, change) {
      store.dispatch('setInitialProfileIfBlank', doc)
      updateStore(doc)
    }
  }
}
const easyProfileFirestore = createEasyFirestore(profile, { logging: true })

export const plugins = [easyFriendsFirestore, easyProfileFirestore]
/** Vuex-Easy-Firestore config **/

/* Plugin appears to cause problems with strict mode
   Disabling strict mode here */
export const strict = false
/* -Friends firestore */

const emptyUser = {
  email: null,
  displayName: null,
  uid: null,
  photoURL: null
}

export const state = () => ({
  user: Object.assign({}, emptyUser),
  whatsUp: []
})

export const getters = {
  activeUser: (state, getters) => {
    if (state.user.uid !== null) {
      return state.user
    } else {
      return null
    }
  },
  friends: state => {
    return state.friends.data
  },
  whatsUp: state => {
    return state.whatsUp
  }
}

export const mutations = {
  setUser(state, payload) {
    if (payload === null) {
      state.user = Object.assign({}, emptyUser)
      this.dispatch('friends/closeDBChannel', { clearModule: true })
      this.dispatch('profile/closeDBChannel', { clearModule: true })
    } else {
      state.user.email = payload.email
      state.user.displayName = payload.displayName
      state.user.uid = payload.uid
      state.user.photoURL = payload.photoURL
      this.dispatch('friends/openDBChannel')
      this.dispatch('profile/openDBChannel')
    }
  },
  setIdToken(state, payload) {
    state.idToken = payload
  },
  mergeWhatsUpRecords(state, records) {
    records.forEach(function(whatsUpRecord) {
      const index = state.whatsUp.findIndex(
        item => item.id === whatsUpRecord.id
      )
      if (index !== -1) {
        state.whatsUp.splice(index, 1, whatsUpRecord)
      } else {
        state.whatsUp.push(whatsUpRecord)
      }
    })
  },
  deleteWhatsUp(state, id) {
    const index = state.whatsUp.findIndex(item => item.id === id)
    if (index !== -1) {
      state.whatsUp.splice(index, 1)
    }
  }
}

export const actions = {
  signInWithGoogle({ commit }) {
    return auth.signInWithRedirect(GoogleProvider)
  },

  signOut({ commit }) {
    auth
      .signOut()
      .then(() => {
        commit('setUser', null)
      })
      .catch(err => console.log(err)) // eslint-disable-line no-console
  },

  changeUp({ commit, state }, { id, isUp }) {
    axios({
      method: 'post',
      url: 'https://europe-west1-up-now-a6da8.cloudfunctions.net/app/up/' + id,
      data: { isUp },
      headers: {
        Authorization: 'Bearer ' + state.idToken
      }
    })
      .then(response => {
        commit('mergeWhatsUpRecords', response.data)
      })
      .catch(error => {
        console.log('Unable to respond to up id ' + id, error) // eslint-disable-line no-console
      })
  },

  deleteUp({ commit, state }, id) {
    axios({
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + state.idToken,
        'Content-Type': 'application/json'
      },
      url: 'https://europe-west1-up-now-a6da8.cloudfunctions.net/app/up/' + id
    })
      .then(response => {
        commit('deleteWhatsUp', id)
      })
      .catch(error => {
        console.log('Delete failed, not removing element', error) // eslint-disable-line no-console
      })
  },

  addFriend({ dispatch }, payload) {
    dispatch(
      'friends/set',
      Object.assign(
        {
          id: payload.uid
        },
        payload
      )
    )
  },

  setInitialProfileIfBlank({ dispatch, state }, doc) {
    const profileUpdate = {}
    let changed = false
    if (state.user == null) {
      // Nobody is logged in, just return
      return
    }
    if (doc.name == null) {
      profileUpdate.name = state.user.displayName
      changed = true
    }
    if (doc.email == null) {
      profileUpdate.email = state.user.email
      changed = true
    }
    if (changed) {
      dispatch('profile/patch', profileUpdate)
    }
  }
}
