import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate, { Validator } from 'vee-validate'
import { mount, config } from '@vue/test-utils'
import mocksdk from '@/services/__mocks__/fireinit.js'
import Util from '@/test/utils.js'

jest.mock('../services/fireinit.js', () => {
  return mocksdk
})

import Friends from '@/pages/friends.vue'

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
      { id: 'arthur@arthur_com', email: 'arthur@arthur.com', name: 'Arthur' },
      { id: 'jenny@jenny_com', email: 'jenny@jenny.com', name: 'Jenny' }
    ]
    const mountedForm = mount(Friends, {
      mocks: Util.mockDataStore({ uid: '123', friends: friendList })
    })
    expect(mountedForm.contains('[jest="friends-list"]')).toBe(true)
    expect(mountedForm.findAll(".friend").length).toBe(2)
  })
})
