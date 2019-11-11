import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config } from '@vue/test-utils'
import Util from '@/test/utils.js'

import Index from '@/pages/up/_activity/index.vue'

Vue.use(Vuetify)

config.stubs['nuxt-link'] = '<a><slot /></a>'
config.stubs['nuxt-child'] = '<br />'

describe('up/_activity/index.vue', () => {
  test('Shows the friend list', () => {
    const friends = Util.friendList(2)
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({ uid: '123', friends: friends, routeParams: { activity: 'play' }})
    })
    expect(mountedCard.contains('[jest="friends-list"]')).toBe(true)
    expect(mountedCard.findAll(".friend").length).toBe(2)
    expect(mountedCard.find(".headline").text()).toBe('Play')
    expect(mountedCard.find(".friend .name").text()).not.toBe('')
  }),
  test('Shows the friend list with multiple activities', () => {
    const friends = Util.friendList(2)
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({ uid: '123', friends: friends, routeParams: { activity: 'move-relax' }})
    })
    expect(mountedCard.contains('[jest="friends-list"]')).toBe(true)
    expect(mountedCard.findAll(".friend").length).toBe(2)
    expect(mountedCard.find(".friend .name").text()).not.toBe('')
    expect(mountedCard.find(".headline").text()).toBe('Move or Relax')
  }),
  test('Shows the friend list with three activities', () => {
    const friends = Util.friendList(2)
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({ uid: '123', friends: friends, routeParams: { activity: 'move-relax-out' }})
    })
    expect(mountedCard.contains('[jest="friends-list"]')).toBe(true)
    expect(mountedCard.findAll(".friend").length).toBe(2)
    expect(mountedCard.find(".friend .name").text()).not.toBe('')
    expect(mountedCard.find(".headline").text()).toBe('Move, Relax or Go out')
  }),
  test('Shows the friend list sorted', () => {
    const friendList = [
      { uid: 'vRHbWPYcJdVbv33kopy4fNWDgwg1', name: 'Zach' },
      { uid: 'uurGYXhegkXrW0Jy2rH4l75dxOf1', name: 'Arthur' }
    ]
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({ uid: '123', friends: friendList, routeParams: { activity: 'move-relax-out' }})
    })
    expect(mountedCard.contains('[jest="friends-list"]')).toBe(true)
    expect(mountedCard.findAll(".friend").length).toBe(2)
    expect(mountedCard.find(".friend .name").text()).toBe('Arthur')
  }),
  test('Submits data to server', () => {
    let postedData = null
    const friends = Util.friendList(2)
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({ uid: '123', friends: friends, routeParams: { activity: 'play' }, axios: (request) => {
        postedData = request.data
        return new Promise(function(rs,rj) {
          rs('Success!')
        })
      }})
    })
    mountedCard.setData({
      description: 'Let\'s play!'
    })
    mountedCard.vm.showUp()
    expect(postedData).toEqual({
      activity: ['play'],
      friends: friends.map(item => item.uid),
      description: 'Let\'s play!'
    })
  }),
  test('Handles multiple activities', () => {
    let postedData = null
    const friends = Util.friendList(2)
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({ uid: '123', friends: friends, routeParams: { activity: 'play-out' }, axios: (request) => {
        postedData = request.data
        return new Promise(function(rs,rj) {
          rs('Success!')
        })
      }})
    })
    mountedCard.setData({
      description: 'Let\'s play!'
    })
    mountedCard.vm.showUp()
    expect(postedData).toEqual({
      activity: ['play', 'out'],
      friends: friends.map(item => item.uid),
      description: 'Let\'s play!'
    })
  })
})
