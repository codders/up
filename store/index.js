import axios from 'axios'
import { API_BASE_URL } from '~/model/api'

/* Plugin appears to cause problems with strict mode
   Disabling strict mode here */
export const strict = false
/* -Friends firestore */

const emptyUser = {
  email: null,
  displayName: null,
  uid: null,
  photoURL: null,
}

export const state = () => ({
  user: Object.assign({}, emptyUser),
  friends: [],
  loadedFriends: false,
  whatsUp: [],
  profile: {},
  notifications: [],
})

export const getters = {
  activeUser: (state, _getters) => {
    if (state.user.uid !== null) {
      return state.user
    } else {
      return null
    }
  },
  friends: (state) => {
    return state.friends
  },
  whatsUp: (state) => {
    return state.whatsUp
  },
}

let notificationId = 0

export const mutations = {
  setUser(state, payload) {
    if (payload === null) {
      state.user = Object.assign({}, emptyUser)
      state.profile = {}
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
    records.forEach(function (whatsUpRecord) {
      const index = state.whatsUp.findIndex(
        (item) => item.id === whatsUpRecord.id
      )
      if (index !== -1) {
        state.whatsUp.splice(index, 1, whatsUpRecord)
      } else {
        state.whatsUp.push(whatsUpRecord)
      }
    })
  },
  deleteWhatsUp(state, id) {
    const index = state.whatsUp.findIndex((item) => item.id === id)
    if (index !== -1) {
      state.whatsUp.splice(index, 1)
    }
  },
  addFriend(state, friend) {
    const index = state.friends.findIndex((item) => item.uid === friend.uid)
    if (index !== -1) {
      state.friends.splice(index, 1)
    }
    state.friends.push(friend)
  },
  addNotification(state, payload) {
    notificationId++
    state.notifications.push(
      Object.assign({ id: notificationId }, payload.data)
    )
  },
  clearNotification(state, notificationId) {
    const index = state.notifications.findIndex(
      (item) => item.id === notificationId
    )
    if (index !== -1) {
      state.notifications.splice(index, 1)
    }
  },
  updateFriendNotificationSubscription(state, details) {
    const friend = state.friends.find((item) => item.uid === details.frienduid)
    if (friend !== undefined) {
      Object.keys(details.subscription).forEach(function (activity) {
        if (friend.subscription === undefined) {
          friend.subscription = {}
        }
        friend.subscription[activity] = details.subscription[activity]
      })
    }
  },
  deleteFriend(state, frienduid) {
    const index = state.friends.findIndex((item) => item.uid === frienduid)
    if (index !== -1) {
      state.friends.splice(index, 1)
    }
  },
  updateFriendsList(state, friends) {
    state.friends.splice(0, state.friends.length)
    friends.forEach(function (friend) {
      state.friends.push(friend)
    })
    state.loadedFriends = true
  },
  updateProfile(state, profile) {
    state.profile = profile
  },
}

export const actions = {
  signInWithGoogle(_ctx) {
    const provider = new this.$fireModule.auth.GoogleAuthProvider()
    return this.$fire.auth.signInWithRedirect(provider)
  },

  signInWithDiscord(_ctx) {
    window.location.href = API_BASE_URL + "/discord/login"
  },

  discordLoginToken(_ctx, discordCode) {
    console.log("Attempted to exchange code " + discordCode + " for customerauth token") // eslint-disable-line no-console
    return axios({
      method: 'post',
      url: API_BASE_URL + '/discord/token',
      data: { code: discordCode },
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((postResponse) => {
        console.log("Got token response:", postResponse)
        return postResponse.data
      })
      .catch((error) => {
        console.log('Unable to exchange discord token', error) // eslint-disable-line no-console
      })
  },

  signInWithCustomToken({ dispatch }, discordAuth) {
    console.log("Signing in with temp jwt token", discordAuth) // eslint-disable-line no-console
    const jwtToken = discordAuth.authToken
    const userProfile = discordAuth.user
    return this.$fire.auth
      .signInWithCustomToken(jwtToken)
      .then(function (result) {
        console.log('Custom Login Result', result) // eslint-disable-line no-console
        return result.user.auth.currentUser
          .getIdToken()
          .then(function (idToken) {
            return dispatch('userChanged', { user: result.user, idToken }).then(
              () => {
                dispatch('updateProfile', { name: (userProfile.display_name || userProfile.username) })
              }
            )
          })
      })
  },

  signInWithEmail({ dispatch }, payload) {
    return this.$fire.auth
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(function (result) {
        console.log('Result', result) // eslint-disable-line no-console
        return result.user.auth.currentUser
          .getIdToken()
          .then(function (idToken) {
            return dispatch('userChanged', { user: result.user, idToken }).then(
              () => {
                dispatch('updateProfile', { name: payload.name })
              }
            )
          })
      })
  },

  signUpWithEmail({ commit, dispatch }, payload) {
    return this.$fire.auth
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(function (result) {
        console.log('Create result', result) // eslint-disable-line no-console
        return result.user.auth.currentUser
          .getIdToken()
          .then(function (idToken) {
            commit('setIdToken', idToken)
            return dispatch('updateProfile', { name: payload.name })
          })
      })
  },

  signOut({ commit }) {
    this.$fire.auth
      .signOut()
      .then(() => {
        commit('setUser', null)
        commit('setIdToken', null)
      })
      .catch((err) => console.log(err)) // eslint-disable-line no-console
  },

  userChanged({ commit, state }, { user, idToken }) {
    console.log('Got User Changed event', { user, idToken }) // eslint-disable-line no-console
    commit('setIdToken', idToken)
    if (state.user === undefined || state.user.uid !== user.uid) {
      console.log('Loggedin', { user, idToken }) // eslint-disable-line no-console
      return commit('setUser', user)
    }
  },

  clearUser({ commit }) {
    commit('setUser', null)
    commit('setIdToken', null)
  },

  establishSession({ state, dispatch }) {
    if (state.user.uid !== null) {
      return dispatch('loadProfile').then(dispatch('refreshSubscription'))
    } else {
      return Promise.resolve()
    }
  },

  changeUp({ commit, state }, { id, isUp }) {
    axios({
      method: 'post',
      url: API_BASE_URL + '/up/' + id,
      data: { isUp },
      headers: {
        Authorization: 'Bearer ' + state.idToken,
      },
    })
      .then((response) => {
        commit('mergeWhatsUpRecords', response.data)
      })
      .catch((error) => {
        console.log('Unable to respond to up id ' + id, error) // eslint-disable-line no-console
      })
  },

  deleteUp({ commit, state }, id) {
    axios({
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + state.idToken,
        'Content-Type': 'application/json',
      },
      url: API_BASE_URL + '/up/' + id,
    })
      .then((_response) => {
        commit('deleteWhatsUp', id)
      })
      .catch((error) => {
        console.log('Delete failed, not removing element', error) // eslint-disable-line no-console
      })
  },

  addUpRecord({ commit }, payload) {
    commit('mergeWhatsUpRecords', [payload])
  },

  loadFriends({ commit, state }) {
    if (state.loadedFriends) {
      return Promise.resolve(state.friends)
    }
    return axios({
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + state.idToken,
        'Content-Type': 'application/json',
      },
      url: API_BASE_URL + '/friends',
    })
      .then((response) => {
        commit('updateFriendsList', response.data)
      })
      .catch((error) => {
        console.log('Unable to load friends list', error) // eslint-disable-line no-console
      })
  },

  addFriend({ state, commit }, friend) {
    axios({
      method: 'post',
      url: API_BASE_URL + '/friends',
      data: friend,
      headers: {
        Authorization: 'Bearer ' + state.idToken,
      },
    })
      .then((_response) => {
        commit('addFriend', friend)
      })
      .catch((error) => {
        console.log('Unable to respond to add friend', error) // eslint-disable-line no-console
      })
  },

  addFriendByEmail({ state, commit }, email) {
    return axios({
      method: 'post',
      url: API_BASE_URL + '/addFriendByEmail',
      data: { email },
      headers: {
        Authorization: 'Bearer ' + state.idToken,
      },
    }).then((response) => {
      commit('addFriend', response.data)
    })
  },

  inviteFriendByEmail({ state }, email) {
    return axios({
      method: 'post',
      url: API_BASE_URL + '/inviteFriendByEmail',
      data: { email },
      headers: {
        Authorization: 'Bearer ' + state.idToken,
      },
    })
  },

  deleteFriend({ state, commit }, friendUid) {
    return axios({
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + state.idToken,
        'Content-Type': 'application/json',
      },
      url: API_BASE_URL + '/friends/' + friendUid,
    })
      .then((response) => {
        commit('deleteFriend', response.data.uid)
      })
      .catch((error) => {
        console.log('Unable to delete friend', error) // eslint-disable-line no-console
      })
  },

  updateFriendNotificationSubscription({ state, commit }, details) {
    const postData = {}
    postData[details.activity] = details.subscribe
    return axios({
      method: 'post',
      url: API_BASE_URL + '/friends/' + details.uid + '/subscriptions',
      data: postData,
      headers: {
        Authorization: 'Bearer ' + state.idToken,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        commit('updateFriendNotificationSubscription', {
          frienduid: details.uid,
          subscription: response.data,
        })
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(
          'Unable to update subcription to ' + details.uid + ' events',
          error
        )
      })
  },

  refreshSubscription({ dispatch, state, commit }) {
    const fire = this.$fire
    dispatch('askNotificationPermission')
      .then((result) => {
        console.log('Got permission result', result) // eslint-disable-line no-console
        if (result !== 'granted') {
          console.log(
            'Notifications are blocked for this page. Go to settings to unblock them' // eslint-disable-line no-console
          )
          throw new Error('Notifications are blocked')
        }
        return fire.messaging.getToken({
          vapidKey: process.env.VAPID_PUBLIC_KEY,
        })
      })
      .then(function (pushSubscription) {
        // eslint-disable-next-line no-console
        const jsonPayload = JSON.stringify({ fcmToken: pushSubscription })
        console.log('Received PushSubscription: ', jsonPayload) // eslint-disable-line no-console
        return axios({
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + state.idToken,
            'Content-Type': 'application/json',
          },
          data: jsonPayload,
          url: API_BASE_URL + '/saveSubscription',
        })
      })
      .then(function (_subscriptionSaved) {
        console.log('Setting up foreground message processing') // eslint-disable-line no-console
        fire.messaging.onMessage((payload) => {
          console.log('Got message in Foreground', payload) // eslint-disable-line no-console
          commit('addNotification', payload)
        })
      })
      .catch((error) => {
        if (error) {
          console.log(
            'Error asking for permission or subscribing to notification',
            error
          ) // eslint-disable-line no-console
        }
      })
  },

  askNotificationPermission() {
    console.log('Asking for permission') // eslint-disable-line no-console
    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (
        result
      ) {
        resolve(result)
      })

      if (permissionResult) {
        permissionResult.then(resolve, reject)
      }
    }).then(function (permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error("We weren't granted permission.")
      }
      return permissionResult
    })
  },

  loadProfile({ state, commit, dispatch }) {
    return axios({
      method: 'get',
      url: API_BASE_URL + '/profile',
      headers: {
        Authorization: 'Bearer ' + state.idToken,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        let changed = false
        const profileUpdate = {}
        if (response.data.name == null && state.user.displayName !== null) {
          profileUpdate.name = state.user.displayName
          changed = true
        }
        if (response.data.email == null && state.user.displayName !== null) {
          profileUpdate.email = state.user.email
          changed = true
        }
        if (response.data.photoURL == null && state.user.photoURL !== null) {
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
      .catch((error) => {
        console.log('Unable to load profile', error) // eslint-disable-line no-console
      })
  },

  updateProfile({ state, commit }, profileUpdate) {
    console.log("Saving profile update", profileUpdate)
    return axios({
      method: 'post',
      url: API_BASE_URL + '/profile',
      data: profileUpdate,
      headers: {
        Authorization: 'Bearer ' + state.idToken,
        'Content-Type': 'application/json',
      },
    })
      .then((postResponse) => {
        commit('updateProfile', profileUpdate)
        return postResponse.data
      })
      .catch((error) => {
        console.log('Unable to update profile', error) // eslint-disable-line no-console
      })
  },
}
