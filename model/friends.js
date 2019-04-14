export const friendNameByUid = function(friends, uid) {
  const friend = friendByUid(friends, uid)
  if (friend === undefined) {
    return uid
  } else {
    return friend.name
  }
}

export const friendByUid = function(friends, uid) {
  for (const index in friends) {
    if (friends[index].uid === uid) {
      return friends[index]
    }
  }
  return undefined
}

export const loadDirectoryFriends = function($axios, store) {
  return $axios
    .$get('https://europe-west1-up-now-a6da8.cloudfunctions.net/app/friends', {
      headers: {
        Authorization: 'Bearer ' + store.state.idToken
      }
    })
    .then(response => {
      return { directoryFriends: response }
    })
    .catch(error => {
      return {
        directoryFriends: [],
        error: error
      }
    })
}

export const getNameForFriend = function(directoryFriends, uid) {
  for (const id in directoryFriends) {
    if (directoryFriends[id].uid === uid) {
      return directoryFriends[id].name
    }
  }
  return undefined
}

export const filterKnownFriends = function(friends, directoryFriends) {
  const result = []
  for (const id in friends) {
    const name = getNameForFriend(directoryFriends, friends[id].uid)
    if (name !== undefined) {
      result.push({
        uid: friends[id].uid,
        name: name
      })
    }
  }
  return result
}
