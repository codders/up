import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
  createPersistedState({
    key: 'up-session',
    paths: [
      'user',
      'profile',
      'idToken'
    ]
  })(store)
}
