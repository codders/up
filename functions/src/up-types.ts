declare namespace up {
  interface UpRecord {
    activity: string
    email: string
    description: string
    uid: string
    timestamp: {
      _seconds: number
      _nanoseconds: number
    }
    inviteemail: string
  }

  interface UpRequest {
    activity: string
    email: string
    description: string
    uid: string
    friends: string[]
  }
}
