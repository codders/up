import './up-types';


const upLogic = {
  getUpRecordsForRequest: function(request: up.UpRequest) {
    const result: up.UpRecord[] = [];
    request.friends.forEach(function(inviteemail) {
      const record: up.UpRecord = {
        activity: request.activity,
        email: request.email,
        time: request.time,
        uid: request.uid,
        timestamp: {
          _seconds: 0,
          _nanoseconds: 0
        },
        inviteemail: inviteemail
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
