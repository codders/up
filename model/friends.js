export const friendNameByEmail = function(friends, email) {
  for (const index in friends) {
    if (friends[index].email === email) {
      return friends[index].name
    }
  }
  return email
}
