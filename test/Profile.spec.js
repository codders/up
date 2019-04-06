import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate, { Validator } from 'vee-validate'
import { mount, config } from '@vue/test-utils'
import mocksdk from '@/services/__mocks__/fireinit.js'
import Util from '@/test/utils.js'

jest.mock('../services/fireinit.js', () => {
  return mocksdk
})

import Profile from '@/pages/profile.vue'

Vue.use(Vuetify)
Vue.use(VeeValidate, null)

config.stubs['nuxt-link'] = '<a><slot /></a>'

describe('profile.vue', () => {
  test('Displays the user\'s name', () => {
    const mountedForm = mount(Profile, {
      mocks: Util.mockDataStore({ uid: '123', profile: { name: 'Arthur' } })
    })
    expect(mountedForm.contains('[jest="name"]')).toBe(true)
    expect(mountedForm.vm.$options.computed.name.get.call(mountedForm.vm)).toBe('Arthur')
  })
})
