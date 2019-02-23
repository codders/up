import firebase from '@/services/fireinit.js'

const userFriends = function(uid) {
  return firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('friends')
}


const DataModel = {
  userFriends: userFriends,
  userFriend: function(uid, friendEmail) {
    return userFriends(uid)
      .doc(friendEmail)
  }
}

export default DataModel
