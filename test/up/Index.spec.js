import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config } from '@vue/test-utils'
import Util from '@/test/utils.js'

import Index from '@/pages/up/index.vue'

Vue.use(Vuetify)

config.stubs['nuxt-link'] = '<a><slot /></a>'
config.stubs['nuxt-child'] = '<br />'

describe('up/index.vue', () => {
  test('Shows a list of activities', () => {
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({ uid: '123', routeParams: { activity: 'Play', time: 'Now' }})
    })
    expect(mountedCard.contains('[jest="activities-list"]')).toBe(true)
    expect(mountedCard.findAll(".activity").length).toBe(4)
  })
})
