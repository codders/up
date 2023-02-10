import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config, createLocalVue } from '@vue/test-utils'
import { friendList, mockDataStore } from '@/test/utils.js'

import Index from '@/pages/up/_activity/index.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()

config.stubs['nuxt-link'] = { template: "<div></div> "}
config.stubs['nuxt-child'] = { template: '<br />' }

describe('up/_activity/index.vue', () => {
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  test('Shows the friend list', () => {
    const friends = friendList(2)
    const mountedCard = mount(Index, {
      mocks: mockDataStore({ uid: '123', friends, routeParams: { activity: 'play' }}),
      localVue,
      vuetify
    })
    expect(mountedCard.find('[jest="friends-list"]').exists()).toBe(true)
    expect(mountedCard.findAll(".friend").length).toBe(2)
    expect(mountedCard.find(".headline").text()).toBe('Play')
    expect(mountedCard.find(".friend .name").text()).not.toBe('')
  })

  test('Shows the friend list with multiple activities', () => {
    const friends = friendList(2)
    const mountedCard = mount(Index, {
      mocks: mockDataStore({ uid: '123', friends, routeParams: { activity: 'move-relax' }}),
      localVue,
      vuetify
    })
    expect(mountedCard.find('[jest="friends-list"]').exists()).toBe(true)
    expect(mountedCard.findAll(".friend").length).toBe(2)
    expect(mountedCard.find(".friend .name").text()).not.toBe('')
    expect(mountedCard.find(".headline").text()).toBe('Move or Relax')
  })

  test('Shows the friend list with three activities', () => {
    const friends = friendList(2)
    const mountedCard = mount(Index, {
      mocks: mockDataStore({ uid: '123', friends, routeParams: { activity: 'move-relax-out' }}),
      localVue,
      vuetify
    })
    expect(mountedCard.find('[jest="friends-list"]').exists()).toBe(true)
    expect(mountedCard.findAll(".friend").length).toBe(2)
    expect(mountedCard.find(".friend .name").text()).not.toBe('')
    expect(mountedCard.find(".headline").text()).toBe('Move, Relax or Go out')
  })

  test('Shows the friend list sorted', () => {
    const friends = [
      { uid: 'vRHbWPYcJdVbv33kopy4fNWDgwg1', name: 'Zach' },
      { uid: 'uurGYXhegkXrW0Jy2rH4l75dxOf1', name: 'Arthur' }
    ]
    const mountedCard = mount(Index, {
      mocks: mockDataStore({ uid: '123', friends, routeParams: { activity: 'move-relax-out' }}),
      localVue,
      vuetify
    })
    expect(mountedCard.find('[jest="friends-list"]').exists()).toBe(true)
    expect(mountedCard.findAll(".friend").length).toBe(2)
    expect(mountedCard.find(".friend .name").text()).toBe('Arthur')
  })

  test('Submits data to server', async () => {
    let postedData = null
    const friends = friendList(2)
    const mountedCard = mount(Index, {
      mocks: mockDataStore({ uid: '123', friends, routeParams: { activity: 'play' }, axios: (request) => {
        postedData = request.data
        return new Promise(function(resolve,_reject) {
          resolve(
            { message: 'added',
              data: {
                upRequest: {}
              }
            }
          )
        })
      }}),
      localVue,
      vuetify
    })
    await mountedCard.setData({
      description: 'Let\'s play!'
    })
    await mountedCard.vm.selectAll()
    await mountedCard.vm.showUp()
    expect(postedData).toEqual({
      activity: ['play'],
      friends: friends.map(item => item.uid),
      description: 'Let\'s play!'
    })
  })

  test('Handles multiple activities', async () => {
    let postedData = null
    const friends = friendList(2)
    const mountedCard = mount(Index, {
      mocks: mockDataStore({ uid: '123', friends, routeParams: { activity: 'play-out' }, axios: (request) => {
        postedData = request.data
        return new Promise(function(resolve,_reject) {
          resolve(
            { message: 'added',
              data: {
                upRequest: {}
              }
            }
          )
        })
      }}),
      localVue,
      vuetify
    })
    await mountedCard.setData({
      description: 'Let\'s play!'
    })
    await mountedCard.vm.selectAll()
    await mountedCard.vm.showUp()
    expect(postedData).toEqual({
      activity: ['play', 'out'],
      friends: friends.map(item => item.uid),
      description: 'Let\'s play!'
    })
  })
})
