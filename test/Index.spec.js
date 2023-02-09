import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config, createLocalVue } from '@vue/test-utils'
import Util from '@/test/utils.js'

import Index from '@/pages/index.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()

config.stubs['nuxt-link'] = { template: "<div></div> "}
config.stubs['whats-up-list'] = { template: "<div></div> "}
config.stubs['you-are-up-list'] = { template: "<div></div> "}
config.stubs['notification-popup'] = { template: "<div></div>" }

describe('index.vue', () => {
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  test('Displays the greeting string', async () => {
    const mountedForm = mount(Index, {
      mocks: Util.mockDataStore({ uid: '123', profile: { name: 'Arthur' } }),
      localVue,
      vuetify
    })
    await mountedForm.setData({ loading: false })
    expect(mountedForm.vm.loading).toBe(false)
    expect(mountedForm.get('[jest="headline"]')).not.toEqual(null)
    expect(mountedForm.find('[jest="headline"]').text()).toBe('Welcome to Up, Arthur')
  })
})
