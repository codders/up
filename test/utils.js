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
      activeUser: user,
      friends: friends
    }
  }
}

const mockDataStore = function({ uid, friends, dispatcher, router, routeParams, axios }) {
  return mockWithStore({ store: dataStore({ uid: uid, friends: friends, dispatcher: dispatcher }), router: router, routeParams: routeParams, axios: axios })
}

const mockWithStore = function({ store, router, routeParams, axios }) {
  return {
    $log: {
      debug: (...args) => {} 
    },
    $axios: axios,
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
    },
    $route: {
      params: (routeParams || {})
    }
  }
}

const Util = {
  mockDataStore: mockDataStore,
}

export default Util 
