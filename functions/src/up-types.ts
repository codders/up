declare namespace vapid {
  interface Key {
    pub: string
    secret: string
  }
}

declare namespace up {
  interface UpRecord {
    activity: string[]
    inviteduid: string
    description: string
    uid: string
    parentId: string
    timestamp: {
      _seconds: number
      _nanoseconds: number
    },
    isUp: boolean
  }

  interface UpRecordWithName extends UpRecord {
    name: string
  }

  interface SavedUpRecord extends UpRecord {
    id: string
  }

  interface SavedUpRecordWithName extends SavedUpRecord {
    name: string
  }

  interface UpRequest {
    activity: string[]
    description: string
    friends: string[]
  }

  interface SavedUpRequest extends UpRequest {
    id: string,
    uid: string
  }

  interface SavedUpRequestWithNameAndAcceptedFriends extends SavedUpRequest {
    acceptedFriends: string[],
    pendingFriends: string[],
    name: string
  }

  interface UpRequestWithParent extends UpRequest {
    parentId: string,
    uid: string
  }

  interface DirectoryEntry {
    uid: string
    name: string
  }

  interface InterestRegister {
    uid: string,
    activity: string[]
  }

  interface UserRecord {
    id: string,
    name: string,
    photoURL?: string
  }

  interface ProfileDetails {
    name: string,
    photoURL: string
  }

  interface FriendRecord {
    uid: string,
    photoURL?: string,
    subscription: { [id: string]: boolean }
  }

  interface FriendRecordWithName extends FriendRecord {
    name: string
  }

  interface SignupInvite {
      email: string,
      inviter: string
  }

  interface SavedSignupInvite extends SignupInvite {
    id: string
  }

  interface SavedSignupInviteWithName extends SavedSignupInvite {
    inviterName: string
  }

}
