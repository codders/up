import 'firebase-functions-test'

import { findMatches, getUpRecordsForRequest } from '../src/up-logic'

describe('matching logic', () => {
  it('should not return empty', () => {
    expect(
      findMatches([
        {
          activity: ['play'],
          inviteduid: 'abc',
          description: 'fish',
          name: 'somename',
          parentId: 'abd',
          isUp: false,
          uid: 'def',
          timestamp: {
            _seconds: 1,
            _nanoseconds: 2,
          },
        },
      ]).length
    ).not.toBe(0)
  })
})

describe('up record generation logic', () => {
  it('should create up records if people are interested to receive them', () => {
    const createdRecords = getUpRecordsForRequest(
      {
        activity: ['play'],
        description: 'fish',
        id: 'abd',
        uid: 'abc',
        friends: ['def'],
      },
      'Username',
      {
        def: { uid: 'def', activity: ['play', 'move'] },
      }
    )
    expect(createdRecords.length).toBe(1)
  }),
    it('should not create up records if people are not interested to receive them', () => {
      const createdRecords = getUpRecordsForRequest(
        {
          activity: ['play'],
          description: 'fish',
          id: 'abd',
          uid: 'abc',
          friends: ['def'],
        },
        'Username',
        {
          def: { uid: 'def', activity: ['eat'] },
        }
      )
      expect(createdRecords.length).toBe(0)
    })
})
