import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config } from '@vue/test-utils'
import Util from '@/test/utils.js'

import Index from '@/pages/up/_activity/index.vue'

Vue.use(Vuetify)

config.stubs['nuxt-link'] = '<a><slot /></a>'
config.stubs['nuxt-child'] = '<br />'

describe('up/activity/index.vue', () => {
  test('Shows a list of times', () => {
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({ uid: '123' })
    })
    expect(mountedCard.contains('[jest="times-list"]')).toBe(true)
    expect(mountedCard.findAll(".time").length).toBe(5)
  })
})
