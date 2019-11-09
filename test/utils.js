const makeUid = function(length) {
  var text = ""
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

const makeName = function() {
  const names = [ "bob", "sam", "julia" ]
  return names[Math.floor(Math.random() * names.length)]
}

export const friendList = function(friendCount) {
  const result = []
  for (var i=0; i<friendCount; i++) {
    result.push({
      uid: makeUid(15),
      name: makeName()
    })
  }
  return result
}

const dataStore = function({ uid, friends, profile, dispatcher, whatsUp }) {
  const user = (uid === null ? null : { uid: uid })
  return {
    state: {
      friends: (friends == null ? [] : friends),
      loadedFriends: false,
      profile: {
        data: (profile == null ? {} : profile)
      },
      whatsUp: {
        data: (whatsUp == null ? [] : whatsUp)
      }
    },
    dispatch: (method, args) => {
      if (dispatcher !== undefined) {
        dispatcher.push({ method: method, payload: args })
      }
    },
    getters: {
      activeUser: user,
      friends: (friends == null ? [] : friends),
      whatsUp: (whatsUp == null ? [] : whatsUp)
    }
  }
}

const mockDataStore = function({ uid, friends, profile, dispatcher, router, routeParams, axios, whatsUp }) {
  return mockWithStore({ store: dataStore({ uid: uid, profile: profile, friends: friends, dispatcher: dispatcher, whatsUp: whatsUp }), router: router, routeParams: routeParams, axios: axios })
}

const mockWithStore = function({ store, router, routeParams, axios }) {
  return {
    $log: {
      debug: (...args) => {},
      error: (...args) => {}
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
  friendList: friendList
}

export default Util
