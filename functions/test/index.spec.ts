import 'firebase-functions-test';

import upLogic from '../src/up-logic';

describe("matching logic", () => {
  it("should not return empty", done => {
    expect(upLogic.findMatches([{ 
      activity: 'play',
      inviteduid: 'abc',
      description: 'fish',
      uid: 'def',
      timestamp: {
        _seconds: 1,
        _nanoseconds: 2
      }
    }]).length).not.toBe(0);
    done();
  })
})
