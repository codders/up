import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config, createLocalVue } from '@vue/test-utils'
import { mockDataStore } from '@/test/utils.js'

import Index from '@/pages/up/index.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()

config.stubs['nuxt-link'] = { template: '<div></div> ' }
config.stubs['nuxt-child'] = { template: '<br />' }

describe('up/index.vue', () => {
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })
  test('Shows a list of activities', () => {
    const mountedCard = mount(Index, {
      mocks: mockDataStore({
        uid: '123',
        routeParams: { activity: 'Play', time: 'Now' },
      }),
      localVue,
      vuetify,
    })
    expect(mountedCard.find('[jest="activities-list"]').exists()).toBe(true)
    expect(mountedCard.findAll('.activity').length).toBe(4)
  })
})
