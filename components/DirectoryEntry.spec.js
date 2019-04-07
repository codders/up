import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount, mount, config } from '@vue/test-utils'
import Util from '@/test/utils.js'

import DirectoryEntry from '@/components/DirectoryEntry.vue'

Vue.use(Vuetify)
const localVue = createLocalVue()

config.stubs['nuxt-link'] = '<a><slot /></a>'

describe('DirectoryEntry.vue', () => {
  test('Renders friend details', () => {
    const mounted = shallowMount(DirectoryEntry, {
      mocks: Util.mockDataStore({}),
      localVue
    })
    mounted.setProps({
      uid: 'abc',
      name: 'Arthur'
    })
    const tile = mounted.find('v-list-tile-stub')
    expect(tile.find('v-list-tile-title-stub').text()).toBe('Arthur')
  })
  test('Adding friend calls firestore', async () => {
    Vue.config.async = true
    const dispatcher = []
    const mountedForm = mount(DirectoryEntry, {
      mocks: Util.mockDataStore({ uid: '123', dispatcher: dispatcher })
    })
    await mountedForm.vm.addFriend()
    expect(dispatcher.length).toBe(1)
    expect(dispatcher[0].method).toBe('addFriend')
    Vue.config.async = false 
  }),
  test('Removing friend calls firestore', async () => {
    Vue.config.async = true
    const dispatcher = []
    const mountedForm = mount(DirectoryEntry, {
      mocks: Util.mockDataStore({ uid: '123', dispatcher: dispatcher })
    })
    await mountedForm.vm.deleteFriend()
    expect(dispatcher.length).toBe(1)
    expect(dispatcher[0].method).toBe('friends/delete')
    Vue.config.async = false
  }),
  test('Directory renders who is friend', () => {
    const mounted = shallowMount(DirectoryEntry, {
      mocks: Util.mockDataStore({
        uid: '123',
        friends: [{
          uid: 'abc',
          name: 'Arthur'
        }]
      }),
      localVue
    })
    mounted.setProps({
      uid: 'abc',
      name: 'Arthur'
    })
    const tile = mounted.find('v-list-tile-stub')
    expect(tile.findAll('.delete_action').length).toBe(1)
    expect(tile.findAll('.add_action').length).toBe(0)
  }),
  test('Directory renders who is not friend', () => {
    const mounted = shallowMount(DirectoryEntry, {
      mocks: Util.mockDataStore({
        uid: '123',
        friends: [{
          uid: 'abd',
          name: 'Arthur'
        }]
      }),
      localVue
    })
    mounted.setProps({
      uid: 'abc',
      name: 'Arthur'
    })
    const tile = mounted.find('v-list-tile-stub')
    expect(tile.findAll('.delete_action').length).toBe(0)
    expect(tile.findAll('.add_action').length).toBe(1)
  })

})
