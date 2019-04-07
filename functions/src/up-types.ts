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
    uid: string
    timestamp: {
      _seconds: number
      _nanoseconds: number
    }
  }

  interface UpRequest {
    activity: string
    description: string
    uid: string
    friends: string[]
  }

  interface DirectoryEntry {
    uid: string
    name: string
  }
}
