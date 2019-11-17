import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Index from '@/pages/index.vue'
import Util from '@/test/utils.js'

Vue.use(Vuetify)
const localVue = createLocalVue()

describe('index.vue', () => {
  test('Shows login success message when logged in', () => {
    const mountedIndex = shallowMount(Index, {
      mocks: Util.mockDataStore({ uid: '123' }),
      localVue
    })
    expect(mountedIndex.contains('[jest="logged-in-div"]')).toBe(true)
  }),
  test('Shows login form when not logged in', () => {
    const store = Util.mockDataStore({})
    const mountedIndex = shallowMount(Index, {
      mocks: store,
      localVue
    })
    expect(mountedIndex.contains('[jest="logged-in-div"]')).toBe(false)
  })
})
