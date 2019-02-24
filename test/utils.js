const authStore = function(uid) {
  const user = (uid === null ? null : { uid: uid })
  return {
    getters: {
      activeUser: user
    }
  }
}

const mockAuthStore = function(uid) {
  return mockWithStore(authStore(uid))
}

const mockWithStore = function(store) {
  return {
    $store: store,
    $nuxt: {
      $router: {
        replace: () => {
          Promise.resolve()
        }
      }
    }
  }
}

const Util = {
  mockAuthStore: mockAuthStore,
  mockWithStore: mockWithStore,
  authStore: authStore
}

export default Util 
