import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate, { Validator } from 'vee-validate'
import { mount, config } from '@vue/test-utils'
import Util from '@/test/utils.js'

import Friends from '@/pages/friends/index.vue'

Vue.use(Vuetify)
Vue.use(VeeValidate, null)

config.stubs['nuxt-link'] = '<a><slot /></a>'

describe('friends.vue', () => {
  test('Does not show friends list if list is empty', () => {
    const mountedForm = mount(Friends, {
      mocks: Util.mockDataStore({ uid: '123' })
    })
    expect(mountedForm.contains('[jest="friends-list"]')).toBe(false)
  }),
  test('Shows friends list if there are friends', () => {
    const friendList = [
      { uid: 'vRHbWPYcJdVbv33kopy4fNWDgwg1', name: 'Arthur' },
      { uid: 'uurGYXhegkXrW0Jy2rH4l75dxOf1', name: 'Bob' }
    ]
    const mountedForm = mount(Friends, {
      mocks: Util.mockDataStore({ uid: '123', friends: friendList })
    })
    expect(mountedForm.contains('[jest="friends-list"]')).toBe(true)
    expect(mountedForm.findAll(".friend").length).toBe(2)
    expect(mountedForm.find(".friend .name").text()).toBe('Arthur')
  })
})
