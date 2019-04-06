import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config } from '@vue/test-utils'
import Util from '@/test/utils.js'

import Index from '@/pages/up/_activity/index.vue'

Vue.use(Vuetify)

config.stubs['nuxt-link'] = '<a><slot /></a>'
config.stubs['nuxt-child'] = '<br />'

describe('up/activity/time/index.vue', () => {
  test('Shows the friend list', () => {
    const friendList = [
      { id: 'arthur@arthur_com', email: 'arthur@arthur.com', name: 'Arthur' },
      { id: 'jenny@jenny_com', email: 'jenny@jenny.com', name: 'Jenny' }
    ]
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({ uid: '123', friends: friendList, routeParams: { activity: 'play' }})
    })
    expect(mountedCard.contains('[jest="friends-list"]')).toBe(true)
    expect(mountedCard.findAll(".friend").length).toBe(2)
  }),
  test('Submits data to server', () => {
    const friendList = [
      { id: 'arthur@arthur_com', email: 'arthur@arthur.com', name: 'Arthur' },
      { id: 'jenny@jenny_com', email: 'jenny@jenny.com', name: 'Jenny' }
    ]
    let postedData = null
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({ uid: '123', friends: friendList, routeParams: { activity: 'play' }, axios: (request) => {
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
      activity: 'play',
      friends: [],
      description: 'Let\'s play!'
    })
  })
})
