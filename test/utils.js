const dataStore = function({ uid, friends, dispatcher }) {
  const user = (uid === null ? null : { uid: uid })
  return {
    state: {
      friends: {
        data: (friends === null ? [] : friends)
      }
    },
    dispatch: (method, args) => {
      if (dispatcher !== undefined) {
        dispatcher.push({ method: method, payload: args })
      }
    }, 
    getters: {
      activeUser: user
    }
  }
}

const mockDataStore = function(uid, friends) {
  return mockWithStore(dataStore(uid, friends))
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
  mockDataStore: mockDataStore,
}

export default Util 
