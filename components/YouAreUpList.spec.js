import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Util from '@/test/utils.js'

import YouAreUpList from '@/components/YouAreUpList.vue'

Vue.use(Vuetify)
const localVue = createLocalVue()

describe('YouAreUpList.vue', () => {
  test('Shows something is up when I am up', () => {
    const mountedIndex = shallowMount(YouAreUpList, {
      mocks: Util.mockDataStore({
        uid: '123',
        whatsUp: [
          {
            activity: ['play', 'out'],
            description: "Let's do something",
            timestamp: {
              _seconds: 1554534507,
              _nanoseconds: 0,
            },
            uid: '123',
          },
        ],
        axios: {
          $get: function (_) {
            return new Promise(function (resolve, _reject) {
              resolve([])
            })
          },
        },
      }),
      localVue,
    })
    mountedIndex.setData({ loading: false })
    expect(mountedIndex.find('[jest="something-up"]').exists()).toBe(true)
    expect(
      mountedIndex.find('[jest="something-up"]').findAll('you-are-up-stub')
        .length
    ).toBe(1)
  })

  test('Shows nothing is up when there are not things up', () => {
    const mountedIndex = shallowMount(YouAreUpList, {
      mocks: Util.mockDataStore({
        uid: '123',
        axios: {
          $get: function (_) {
            return new Promise(function (resolve, _reject) {
              resolve([])
            })
          },
        },
      }),
      localVue,
    })
    mountedIndex.setData({ loading: false })
    expect(mountedIndex.find('[jest="nothing-up"]').exists()).toBe(true)
  })

  test('Shows nothing when only someone else is up', () => {
    const mountedIndex = shallowMount(YouAreUpList, {
      mocks: Util.mockDataStore({
        uid: '123',
        whatsUp: [
          {
            activity: ['play', 'out'],
            description: "Let's do something",
            timestamp: {
              _seconds: 1554534507,
              _nanoseconds: 0,
            },
            uid: '234',
          },
        ],
        axios: {
          $get: function (_) {
            return new Promise(function (resolve, _reject) {
              resolve([])
            })
          },
        },
      }),
      localVue,
    })
    mountedIndex.setData({ loading: false })
    expect(mountedIndex.find('[jest="nothing-up"]').exists()).toBe(true)
  })
})
