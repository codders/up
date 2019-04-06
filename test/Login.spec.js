import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Index from '@/pages/index.vue'
import Util from '@/test/utils.js'

Vue.use(Vuetify)
const localVue = createLocalVue()

describe('index.vue', () => {
  test('Shows something is up when there are things up', () => {
    const mountedIndex = shallowMount(Index, {
      mocks: Util.mockDataStore({ uid: '123' }),
      localVue
    })
    mountedIndex.setData({
      whatsUp: [ 
        {"inviteemail":"arthur.taylor@gmail.com",
         "activity":"play",
         "email":"arthur.taylor@gmail.com",
         "time":"tonight",
         "uid":"fK0fHCRYb1QZ7NdMoqdYwgENejA2",
         "timestamp": {
            "_seconds":1554534507,
            "_nanoseconds":0
          }
        } 
      ]
    })
    expect(mountedIndex.contains('[jest="something-up"]')).toBe(true)
  }),
  test('Shows nothing is up when there are not things up', () => {
     const mountedIndex = shallowMount(Index, {
      mocks: Util.mockDataStore({ uid: '123' }),
      localVue
    })
    expect(mountedIndex.contains('[jest="nothing-up"]')).toBe(true)
  }),
  test('Shows login success message when logged in', () => {
    const mountedIndex = shallowMount(Index, {
      mocks: Util.mockDataStore({ uid: '123' }),
      localVue
    })
    expect(mountedIndex.contains('[jest="logged-in-div"]')).toBe(true)
  }),
  test('Shows login form when not logged in', () => {
    const store = Util.mockDataStore({ uid: null })
    console.log("Store: ", store)
    const mountedIndex = shallowMount(Index, {
      mocks: store,
      localVue
    })
    expect(mountedIndex.contains('[jest="logged-in-div"]')).toBe(false)
  })
})
