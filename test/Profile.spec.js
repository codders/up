import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config, createLocalVue } from '@vue/test-utils'
import { mockDataStore } from '@/test/utils.js'

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
      mocks: mockDataStore({ uid: '123', profile: { name: 'Arthur' } }),
      localVue,
      vuetify,
    })
    expect(mountedForm.find('[jest="name"]')).not.toEqual(null)
    expect(mountedForm.vm.$data.name).toBe('Arthur')
  })

  test("Works when no name is set", () => {
    const mountedForm = mount(Profile, {
      mocks: mockDataStore({ uid: '123', profile: { } }),
      localVue,
      vuetify,
    })
    expect(mountedForm.find('[jest="name"]').text()).toEqual("")
    expect(mountedForm.vm.$data.name).toBe('')
  })
})
