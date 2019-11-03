import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Util from '@/test/utils.js'

import YouAreUp from '@/components/YouAreUp.vue'

Vue.use(Vuetify)
const localVue = createLocalVue()

describe('YouAreUp.vue', () => {
  test('Renders activity details', () => {
    const mounted = shallowMount(YouAreUp, {
      localVue
    })
    mounted.setProps({
      activity: ['out', 'move']
    })
    const activityText = mounted.find('.youre-up').find('.activity')
    expect(activityText.text()).toBe('Showing up to Go out or Move')
  }),
  test('Renders activity details with description', () => {
    const mounted = shallowMount(YouAreUp, {
      localVue
    })
    mounted.setProps({
      activity: ['play', 'move'],
      description: 'Play with me!'
    })
    const activityText = mounted.find('.youre-up').find('.activity')
    expect(activityText.text()).toBe('Showing up to Play or Move\n    : "Play with me!"')
  }),
  test('Renders activity details with description and triple select', () => {
    const mounted = shallowMount(YouAreUp, {
      localVue
    })
    mounted.setProps({
      activity: ['play', 'relax', 'move'],
      description: 'Play with me!'
    })
    const activityText = mounted.find('.youre-up').find('.activity')
    expect(activityText.text()).toBe('Showing up to Play, Relax or Move\n    : "Play with me!"')
  }),
  test('Does not render empty description', () => {
    const mounted = shallowMount(YouAreUp, {
      localVue
    })
    mounted.setProps({
      activity: ['play'],
      description: ''
    })
    const activityText = mounted.find('.youre-up').find('.activity')
    expect(activityText.text()).toBe('Showing up to Play')
  }),
  test('Delete record sends delete request', () => {
    let deleteUrl = null
    const mounted = shallowMount(YouAreUp, {
      mocks: Util.mockDataStore({ axios: (request) => {
        deleteUrl = request.url
        return new Promise(function(rs,rj) {
          rs('Success!')
        })
      }}),
      localVue
    })
    mounted.vm.cancelUpRequest('abc')
    expect(deleteUrl).toEqual('https://europe-west1-up-now-a6da8.cloudfunctions.net/app/up/abc')
  }),
  test('Renders details of who is up', () => {
    const mounted = shallowMount(YouAreUp, {
      localVue
    })
    mounted.setProps({
      activity: ['play', 'relax', 'move'],
      description: 'Play with me!',
      acceptedFriends: [ 'Arthur' ]
    })
    const acceptedList = mounted.find('.youre-up').find('.accepted')
    expect(acceptedList.text()).toBe('Arthur')
  })
})
