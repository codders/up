import * as up from './up-types';

export const filterInterests = function(proposedActivities: string[], interestedActivities: string[]) {
  return proposedActivities.filter(item => interestedActivities.includes(item))
}

export const getUpRecordsForRequest = function(
    request: up.SavedUpRequest,
    requesterName: string,
    interestedFriends: { [friendUid:string] : up.InterestRegister }
  )
{
  const result: up.UpRecordWithName[] = [];
  request.friends.forEach(function(inviteduid) {
    if (interestedFriends[inviteduid] !== undefined) {
      const filteredInterests = filterInterests(request.activity, interestedFriends[inviteduid].activity)
      if (filteredInterests.length === 0) {
        return;
      }
      const record: up.UpRecordWithName = {
        activity: filteredInterests,
        description: request.description,
        name: requesterName,
        uid: request.uid,
        parentId: request.id,
        isUp: false,
        timestamp: {
          _seconds: 0,
          _nanoseconds: 0
        },
        inviteduid: inviteduid
      };
      result.push(record)
    }
  });
  return result;
}

export const findMatches = function(whatsUp: up.UpRecordWithName[]) {
  return whatsUp;
}
