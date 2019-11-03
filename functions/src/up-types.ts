declare namespace vapid {
  interface Key {
    pub: string
    secret: string
  }
}

declare namespace up {
  interface UpRecord {
    activity: string
    inviteduid: string
    description: string
    name: string
    uid: string
    parentId: string
    timestamp: {
      _seconds: number
      _nanoseconds: number
    },
    isUp: boolean
  }

  interface SavedUpRecord extends UpRecord {
    id: string
  }

  interface UpRequest {
    activity: string
    description: string
    name: string
    friends: string[]
  }

  interface SavedUpRequest extends UpRequest {
    id: string,
    uid: string
  }

  interface SavedUpRequestWithAcceptedFriends extends SavedUpRequest {
    acceptedFriends: string[],
    pendingFriends: string[]
  }

  interface UpRequestWithParent extends UpRequest {
    parentId: string,
    uid: string
  }

  interface DirectoryEntry {
    uid: string
    name: string
  }
}
