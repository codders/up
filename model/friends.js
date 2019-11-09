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

export const getNameForFriend = function(directoryFriends, uid) {
  for (const id in directoryFriends) {
    if (directoryFriends[id].uid === uid) {
      return directoryFriends[id].name
    }
  }
  return undefined
}
