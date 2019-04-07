import './up-types';


const upLogic = {
  getUpRecordsForRequest: function(request: up.UpRequest) {
    const result: up.UpRecord[] = [];
    request.friends.forEach(function(inviteduid) {
      const record: up.UpRecord = {
        activity: request.activity,
        description: request.description,
        uid: request.uid,
        timestamp: {
          _seconds: 0,
          _nanoseconds: 0
        },
        inviteduid: inviteduid
      };
      result.push(record)
    });
    return result;
  },
  findMatches: function(whatsUp: up.UpRecord[]) {
    return whatsUp;
  }
}

export default upLogic;
