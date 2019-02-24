import { auth, GoogleProvider } from '@/services/fireinit.js'

/* Friends firestore */
import createEasyFirestore from 'vuex-easy-firestore'
const friends = {
  firestorePath: 'users/{userId}/friends',
  firestoreRefType: 'collection',
  moduleName: 'friends',
  statePropName: 'data',
  namespaced: true
}
const easyFriendsFirestore = createEasyFirestore(friends, { logging: true })
export const plugins = [easyFriendsFirestore]
/* -Friends firestore */

const emptyUser = {
  email: null,
  displayName: null,
  uid: null,
  photoURL: null
}

export const state = () => ({
  user: Object.assign({}, emptyUser)
})

export const getters = {
  activeUser: (state, getters) => {
    if (state.user.uid !== null) {
      return state.user
    } else {
      return null
    }
  }
}

export const mutations = {
  setUser(state, payload) {
    if (payload === null) {
      state.user = Object.assign({}, emptyUser)
    } else {
      state.user.email = payload.email
      state.user.displayName = payload.displayName
      state.user.uid = payload.uid
      state.user.photoURL = payload.photoURL
      this.dispatch('friends/openDBChannel', { clearModule: true })
    }
  }
}

export const actions = {
  autoSignIn({ commit }, payload) {
    commit('setUser', payload)
  },

  signInWithGoogle({ commit }) {
    return new Promise((resolve, reject) => {
      auth.signInWithRedirect(GoogleProvider)
      resolve()
    })
  },

  signOut({ commit }) {
    auth
      .signOut()
      .then(() => {
        commit('setUser', null)
      })
      .catch(err => console.log(err)) // eslint-disable-line no-console
  }
}
