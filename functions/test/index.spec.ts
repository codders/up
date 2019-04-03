import 'firebase-functions-test';

import upLogic from '../src/up-logic';

describe("matching logic", () => {
  it("should not return empty", done => {
    expect(upLogic.findMatches([]).length).not.toBe(0);
    done();
  })
})
