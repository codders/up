import { auth } from '@/services/fireinit.js'

export default context => {
  const { store } = context

  return new Promise((resolve, reject) => {
    const updateUser = user => {
      if (user != null) {
        user.getIdToken().then(function(idToken) {
          store.dispatch('userChanged', { user, idToken }).then(() => resolve())
        })
      } else {
        store.dispatch('clearUser').then(() => resolve())
      }
    }

    auth.onAuthStateChanged(updateUser)
    auth.onIdTokenChanged(updateUser)
  })
}
