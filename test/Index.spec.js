import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate, { Validator } from 'vee-validate'
import { mount, config } from '@vue/test-utils'
import Util from '@/test/utils.js'

import Index from '@/pages/index.vue'

Vue.use(Vuetify)
Vue.use(VeeValidate, null)

config.stubs['nuxt-link'] = '<a><slot /></a>'
config.stubs['whats-up-list'] = '<a><slot /></a>'
config.stubs['you-are-up-list'] = '<a><slot /></a>'

describe('index.vue', () => {
  test('Displays the greeting string', () => {
    const mountedForm = mount(Index, {
      mocks: Util.mockDataStore({ uid: '123', profile: { name: 'Arthur' } })
    })
    expect(mountedForm.contains('[jest="headline"]')).toBe(true)
    expect(mountedForm.find('[jest="headline"]').text()).toBe('Welcome to Up, Arthur')
  })
})
