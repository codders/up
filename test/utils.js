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

const mockDataStore = function({ uid, friends, dispatcher, router }) {
  return mockWithStore({ store: dataStore({ uid: uid, friends: friends, dispatcher: dispatcher }), router: router })
}

const mockWithStore = function({ store, router }) {
  return {
    $store: store,
    $nuxt: {
      $router: {
        replace: (route) => {
          if (router != null) {
            router.push(route)
          }
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
