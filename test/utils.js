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

export const directoryFriends = function(friendList) {
  const result = []
  for (const id in friendList) {
    result.push({
      uid: friendList[id].uid,
      name: makeName()
    })
  }
  return result
}

export const friendList = function(friendCount) {
  const result = []
  for (var i=0; i<friendCount; i++) {
    result.push({
      uid: makeUid(15)
    })
  }
  return result
}

const dataStore = function({ uid, friends, profile, dispatcher }) {
  const user = (uid === null ? null : { uid: uid })
  return {
    state: {
      friends: {
        data: (friends == null ? [] : friends)
      },
      profile: {
        data: (profile == null ? {} : profile)
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

const mockDataStore = function({ uid, friends, profile, dispatcher, router, routeParams, axios }) {
  return mockWithStore({ store: dataStore({ uid: uid, profile: profile, friends: friends, dispatcher: dispatcher }), router: router, routeParams: routeParams, axios: axios })
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
  friendList: friendList,
  directoryFriends: directoryFriends
}

export default Util 
