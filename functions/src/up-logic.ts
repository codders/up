import './up-types';

export const filterInterests = function(proposedActivities: string[], interestedActivities: string[]) {
  return proposedActivities.filter(item => interestedActivities.includes(item))
}

export const getUpRecordsForRequest = function(
    request: up.UpRequestWithParent,
    interestedFriends: { [friendUid:string] : up.InterestRegister }
  )
{
  const result: up.UpRecord[] = [];
  request.friends.forEach(function(inviteduid) {
    if (interestedFriends[inviteduid] !== undefined) {
      const filteredInterests = filterInterests(request.activity, interestedFriends[inviteduid].activity)
      if (filteredInterests.length === 0) {
        return;
      }
      const record: up.UpRecord = {
        activity: filteredInterests,
        description: request.description,
        name: request.name,
        uid: request.uid,
        parentId: request.parentId,
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

export const findMatches = function(whatsUp: up.UpRecord[]) {
  return whatsUp;
}
