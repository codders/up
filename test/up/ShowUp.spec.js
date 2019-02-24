import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config } from '@vue/test-utils'
import Util from '@/test/utils.js'

import Index from '@/pages/up/_activity/_time/index.vue'

Vue.use(Vuetify)

config.stubs['nuxt-link'] = '<a><slot /></a>'
config.stubs['nuxt-child'] = '<br />'

describe('up/activity/time/index.vue', () => {
  test('Shows the friend list', () => {
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({ uid: '123' })
    })
    expect(mountedCard.contains('[jest="friends-list"]')).toBe(true)
    expect(mountedCard.findAll(".friend").length).toBe(2)
  })
})
