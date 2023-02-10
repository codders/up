import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config, createLocalVue } from '@vue/test-utils'
import Util from '@/test/utils.js'

import Profile from '@/pages/profile.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()

config.stubs['nuxt-link'] = { template: '<div></div> ' }

describe('profile.vue', () => {
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  test("Displays the user's name", () => {
    const mountedForm = mount(Profile, {
      mocks: Util.mockDataStore({ uid: '123', profile: { name: 'Arthur' } }),
      localVue,
      vuetify,
    })
    expect(mountedForm.findComponent('[jest="name"]')).not.toEqual(null)
    expect(mountedForm.vm.$data.name).toBe('Arthur')
  })
})
