const makeUid = function (length) {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

const makeName = function () {
  const names = ['bob', 'sam', 'julia']
  return names[Math.floor(Math.random() * names.length)]
}

export const friendList = function (friendCount) {
  const result = []
  for (let i = 0; i < friendCount; i++) {
    result.push({
      uid: makeUid(15),
      name: makeName(),
    })
  }
  return result
}

const dataStore = function ({
  uid,
  friends,
  profile,
  dispatcher,
  dispatcherPromises,
  whatsUp,
}) {
  const user = uid === undefined ? null : { uid }
  return {
    state: {
      friends: friends == null ? [] : friends,
      loadedFriends: false,
      profile: profile == null ? {} : profile,
      whatsUp: {
        data: whatsUp == null ? [] : whatsUp,
      },
    },
    dispatch: (method, args) => {
      if (dispatcher !== undefined) {
        dispatcher.push({ method, payload: args })
        if (
          dispatcherPromises !== undefined &&
          dispatcherPromises[method] !== undefined
        ) {
          return dispatcherPromises[method]
        }
      }
    },
    getters: {
      activeUser: user,
      friends: friends == null ? [] : friends,
      whatsUp: whatsUp == null ? [] : whatsUp,
    },
  }
}

export const mockDataStore = function ({
  uid,
  friends,
  profile,
  dispatcher,
  dispatcherPromises,
  router,
  routeParams,
  axios,
  whatsUp,
}) {
  return mockWithStore({
    store: dataStore({
      uid,
      profile,
      friends,
      dispatcher,
      dispatcherPromises,
      whatsUp,
    }),
    router,
    routeParams,
    axios,
  })
}

export const mockWithStore = function ({ store, router, routeParams, axios }) {
  return {
    $log: {
      debug: (..._args) => {},
      error: (..._args) => {},
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
        },
      },
      $on: (_x, _y) => {},
    },
    $route: {
      params: routeParams || {},
    },
    $fire: {
      auth: {
        getRedirectResult: () => {
          return Promise.resolve({ user: null })
        },
      },
    },
  }
}
