import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate, { Validator } from 'vee-validate'
import { mount, config } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import mocksdk from '@/services/__mocks__/fireinit.js'
import Util from '@/test/utils.js'

jest.mock('../services/fireinit.js', () => {
  return mocksdk
})

import AddFriend from '@/pages/add-friend.vue'

Vue.use(Vuetify)
Vue.use(VeeValidate, null)

config.stubs['nuxt-link'] = '<a><slot /></a>'

describe('add-friend.vue', () => {
  test('Shows directory listing', () => {
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123' })
    })
    expect(mountedForm.contains('[jest="directory-listing"]')).toBe(true)
  }),
  test('Entries shown matches directory size', () => {
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123' })
    })
    mountedForm.setData({
      directoryEntries: [
        { uid: 'abc', name: 'Arthur' },
        { uid: 'def', name: 'Jenny' }
      ]
    })
    expect(mountedForm.findAll('.entry').length).toBe(2)
  })
})
