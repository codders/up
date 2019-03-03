import { auth } from '@/services/fireinit.js'

export default context => {
  const { store } = context

  return new Promise((resolve, reject) => {
    const updateUser = user => {
      if (user != null) {
        user.getIdToken().then(function(idToken) {
          store.commit('setUser', user)
          store.commit('setIdToken', idToken)
          resolve()
        })
      } else {
        store.commit('setUser', null)
        store.commit('setIdToken', null)
        resolve()
      }
    }

    auth.onAuthStateChanged(updateUser)
    auth.onIdTokenChanged(updateUser)
  })
}
