const mockAuthStore = function(uid) {
  const user = (uid === null ? null : { uid: uid })
  return {
    $store: {
      getters: {
        activeUser: user
      }
    }
  }
}

const Util = {
  mockAuthStore: mockAuthStore
}

export default Util 
