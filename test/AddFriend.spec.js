import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate, { Validator } from 'vee-validate'
import { mount, config } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Util from '@/test/utils.js'

import AddFriend from '@/pages/add-friend.vue'

Vue.use(Vuetify)
Vue.use(VeeValidate, null)

config.stubs['nuxt-link'] = '<a><slot /></a>'

describe('add-friend.vue', () => {
  test('Shows directory listing', () => {
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123' })
    })
    mountedForm.setData({
      directoryEntries: [
        { uid: 'abc', name: 'Arthur' },
        { uid: 'def', name: 'Jenny' }
      ]
    })
    expect(mountedForm.contains('[jest="directory-listing"]')).toBe(true)
  }),
  test('Does not show directory listing for empty directory', () => {
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123' })
    })
    expect(mountedForm.contains('[jest="directory-listing"]')).toBe(false)
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
