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
      mocks: Util.mockDataStore({ uid: '123', axios: {
        '$get': function(request) {
           return new Promise(function(rs,rj) {
             rs([])
           })
         }
        }
      }),
      localVue
    })
    mountedIndex.setData({
      youreUp: [ 
        {"activity":["play","out"],
         "description": "Let's do something",
         "timestamp": {
            "_seconds":1554534507,
            "_nanoseconds":0
          }
        } 
      ]
    })
    expect(mountedIndex.contains('[jest="something-up"]')).toBe(true)
    expect(mountedIndex.find('[jest="something-up"]').findAll('you-are-up-stub').length).toBe(1)
  }),
  test('Shows nothing is up when there are not things up', () => {
    const mountedIndex = shallowMount(YouAreUpList, {
      mocks: Util.mockDataStore({ uid: '123', axios: {
        '$get': function(request) {
           return new Promise(function(rs,rj) {
             rs([])
           })
         }
        }
      }),
      localVue
    })
    expect(mountedIndex.contains('[jest="nothing-up"]')).toBe(true)
  })
})
