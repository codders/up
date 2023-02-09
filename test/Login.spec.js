import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Index from '@/pages/index.vue'
import Util from '@/test/utils.js'

Vue.use(Vuetify)
const localVue = createLocalVue()

describe('index.vue', () => {
  test('Shows login success message when logged in', async () => {
    const mountedIndex = shallowMount(Index, {
      mocks: Util.mockDataStore({ uid: '123' }),
      localVue
    })
    await mountedIndex.setData({ loading: false })
    expect(mountedIndex.find('[jest="logged-in-div"]').exists()).toBe(true)
  }),
  test('Shows login form when not logged in', async () => {
    const store = Util.mockDataStore({})
    const mountedIndex = shallowMount(Index, {
      mocks: store,
      localVue
    })
    await mountedIndex.setData({ loading: false })
    expect(mountedIndex.find('[jest="logged-in-div"]').exists()).toBe(false)
  })
})
