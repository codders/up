import axios from 'axios'

import { auth, GoogleProvider } from '@/services/fireinit.js'

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
  friends: [],
  loadedFriends: false,
  whatsUp: [],
  profile: {}
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
    return state.friends
  },
  whatsUp: state => {
    return state.whatsUp
  }
}

export const mutations = {
  setUser(state, payload) {
    if (payload === null) {
      state.user = Object.assign({}, emptyUser)
    } else {
      state.user.email = payload.email
      state.user.displayName = payload.displayName
      state.user.photoURL = payload.photoURL
      if (state.user.uid !== payload.uid) {
        state.user.uid = payload.uid
      }
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
  },
  addFriend(state, friend) {
    const index = state.friends.findIndex(item => item.uid === friend.uid)
    if (index !== -1) {
      state.friends.splice(index, 1)
    }
    state.friends.push(friend)
  },
  updateFriendNotificationSubscription(state, details) {
    const friend = state.friends.find(item => item.uid === details.frienduid)
    if (friend !== undefined) {
      Object.keys(details.subscription).forEach(function(activity) {
        if (friend.subscription === undefined) {
          friend.subscription = {}
        }
        friend.subscription[activity] = details.subscription[activity]
      })
    }
  },
  deleteFriend(state, frienduid) {
    const index = state.friends.findIndex(item => item.uid === frienduid)
    if (index !== -1) {
      state.friends.splice(index, 1)
    }
  },
  updateFriendsList(state, friends) {
    state.friends.splice(0, state.friends.length)
    friends.forEach(function(friend) {
      state.friends.push(friend)
    })
    state.loadedFriends = true
  },
  updateProfile(state, profile) {
    state.profile = profile
  }
}

const BASE_URL = 'https://europe-west1-up-now-a6da8.cloudfunctions.net/app'

export const actions = {
  signInWithGoogle({ commit }) {
    return auth.signInWithRedirect(GoogleProvider)
  },

  signOut({ commit, dispatch }) {
    auth
      .signOut()
      .then(() => {
        commit('setUser', null)
      })
      .catch(err => console.log(err)) // eslint-disable-line no-console
  },

  userChanged({ commit, state, dispatch }, { user, idToken }) {
    if (state.user === undefined || state.user.uid !== user.uid) {
      commit('setUser', user)
      commit('setIdToken', idToken)
      console.log('Loggedin', { user, idToken }) // eslint-disable-line no-console
      return dispatch('loadProfile')
    }
  },

  clearUser({ commit, dispatch }) {
    commit('setUser', null)
    commit('setIdToken', null)
  },

  changeUp({ commit, state }, { id, isUp }) {
    axios({
      method: 'post',
      url: BASE_URL + '/up/' + id,
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
      url: BASE_URL + '/up/' + id
    })
      .then(response => {
        commit('deleteWhatsUp', id)
      })
      .catch(error => {
        console.log('Delete failed, not removing element', error) // eslint-disable-line no-console
      })
  },

  loadFriends({ commit, state }) {
    if (state.loadedFriends) {
      return Promise.resolve(state.friends)
    }
    return axios({
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + state.idToken,
        'Content-Type': 'application/json'
      },
      url: BASE_URL + '/friends'
    })
      .then(response => {
        commit('updateFriendsList', response.data)
      })
      .catch(error => {
        console.log('Unable to load friends list', error) // eslint-disable-line no-console
      })
  },

  addFriend({ dispatch, state, commit }, friend) {
    axios({
      method: 'post',
      url: BASE_URL + '/friends',
      data: friend,
      headers: {
        Authorization: 'Bearer ' + state.idToken
      }
    })
      .then(response => {
        commit('addFriend', friend)
      })
      .catch(error => {
        console.log('Unable to respond to add friend', error) // eslint-disable-line no-console
      })
  },

  addFriendByEmail({ dispatch, state, commit }, email) {
    return axios({
      method: 'post',
      url: BASE_URL + '/addFriendByEmail',
      data: { email },
      headers: {
        Authorization: 'Bearer ' + state.idToken
      }
    }).then(response => {
      commit('addFriend', response.data)
    })
  },

  deleteFriend({ state, commit }, friendUid) {
    return axios({
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + state.idToken,
        'Content-Type': 'application/json'
      },
      url: BASE_URL + '/friends/' + friendUid
    })
      .then(response => {
        commit('deleteFriend', response.data.uid)
      })
      .catch(error => {
        console.log('Unable to delete friend', error) // eslint-disable-line no-console
      })
  },

  updateFriendNotificationSubscription({ state, commit }, details) {
    const postData = {}
    postData[details.activity] = details.subscribe
    return axios({
      method: 'post',
      url: BASE_URL + '/friends/' + details.uid + '/subscriptions',
      data: postData,
      headers: {
        Authorization: 'Bearer ' + state.idToken,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        commit('updateFriendNotificationSubscription', {
          frienduid: details.uid,
          subscription: response.data
        })
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(
          'Unable to update subcription to ' + details.uid + ' events',
          error
        )
      })
  },

  loadProfile({ state, commit, dispatch }) {
    return axios({
      method: 'get',
      url: BASE_URL + '/profile',
      headers: {
        Authorization: 'Bearer ' + state.idToken,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        let changed = false
        const profileUpdate = {}
        if (response.data.name == null) {
          profileUpdate.name = state.user.displayName
          changed = true
        }
        if (response.data.email == null) {
          profileUpdate.email = state.user.email
          changed = true
        }
        if (response.data.photoURL == null) {
          profileUpdate.photoURL = state.user.photoURL
          changed = true
        }
        if (changed) {
          return dispatch('updateProfile', profileUpdate)
        } else {
          commit('updateProfile', response.data)
          return Promise.resolve(response.data)
        }
      })
      .catch(error => {
        console.log('Unable to load profile', error) // eslint-disable-line no-console
      })
  },

  updateProfile({ state, commit }, profileUpdate) {
    return axios({
      method: 'post',
      url: BASE_URL + '/profile',
      data: profileUpdate,
      headers: {
        Authorization: 'Bearer ' + state.idToken,
        'Content-Type': 'application/json'
      }
    })
      .then(postResponse => {
        commit('updateProfile', profileUpdate)
        return postResponse.data
      })
      .catch(error => {
        console.log('Unable to update profile', error) // eslint-disable-line no-console
      })
  }
}
