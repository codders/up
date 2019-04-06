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
  user: Object.assign({}, emptyUser)
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
  },
  setIdToken(state, payload) {
    state.idToken = payload
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

  addFriend({ dispatch }, payload) {
    dispatch(
      'friends/set',
      Object.assign(
        {
          id: payload.email.replace(/\./g, '\ufe52')
        },
        payload
      )
    )
  }
}
