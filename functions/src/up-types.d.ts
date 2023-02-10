export interface UpRecord {
  activity: string[];
  inviteduid: string;
  description: string;
  uid: string;
  parentId: string;
  timestamp: {
    _seconds: number;
    _nanoseconds: number;
  };
  isUp: boolean;
}

export interface UpRecordWithName extends UpRecord {
  name: string;
}

export interface SavedUpRecord extends UpRecord {
  id: string;
}

export interface SavedUpRecordWithName extends SavedUpRecord {
  name: string;
}

export interface UpRequest {
  activity: string[];
  description: string;
  friends: string[];
}

export interface SavedUpRequest extends UpRequest {
  id: string;
  uid: string;
}

export interface SavedUpRequestWithNameAndAcceptedFriends
  extends SavedUpRequest {
  acceptedFriends: string[];
  pendingFriends: string[];
  name: string;
}

export interface DirectoryEntry {
  uid: string;
  name: string;
}

export interface InterestRegister {
  uid: string;
  activity: string[];
}

export interface UserRecord {
  id: string;
  name: string;
  photoURL?: string;
}

export interface ProfileDetails {
  name: string;
  photoURL: string;
}

export interface FriendRecord {
  uid: string;
  photoURL?: string;
  subscription: { [id: string]: boolean };
}

export interface FriendRecordWithName extends FriendRecord {
  name: string;
}

export interface SignupInvite {
  email: string;
  inviter: string;
}

export interface SavedSignupInvite extends SignupInvite {
  id: string;
}

export interface SavedSignupInviteWithName extends SavedSignupInvite {
  inviterName: string;
}
