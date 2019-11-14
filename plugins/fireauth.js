import { auth } from '@/services/fireinit.js'

export default context => {
  const { store } = context

  return new Promise((resolve, reject) => {
    const updateUser = user => {
      if (user != null) {
        console.log('Getting ID Token') // eslint-disable-line no-console
        user
          .getIdToken()
          .then(function(idToken) {
            console.log('IdToken is now', idToken) // eslint-disable-line no-console
            store
              .dispatch('userChanged', { user, idToken })
              .then(() => resolve())
          })
          .catch(function(err) {
            console.log('Unable to get token', err) // eslint-disable-line no-console
          })
      } else {
        store.dispatch('clearUser').then(() => resolve())
      }
    }

    const updateIdToken = token => {
      console.log('Got token change', token) // eslint-disable-line no-console
      updateUser(token)
    }

    const updateUserCallback = user => {
      console.log('Got user change', user) // eslint-disable-line no-console
      updateUser(user)
    }

    auth.onAuthStateChanged(updateUserCallback)
    auth.onIdTokenChanged(updateIdToken)
  })
}
