import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Util from '@/test/utils.js'

import WhatsUpList from '@/components/WhatsUpList.vue'

Vue.use(Vuetify)
const localVue = createLocalVue()

describe('WhatsUpList.vue', () => {
  test('Shows something is up when there are things up', () => {
    const mountedIndex = shallowMount(WhatsUpList, {
      mocks: Util.mockDataStore({ uid: '123',
      whatsUp: [
          {"inviteemail":"arthur.taylor@gmail.com",
           "activity":["play","out"],
           "uid":"fK0fHCRYb1QZ7NdMoqdYwgENejA2",
           "description": "Let's do something",
           "timestamp": {
              "_seconds":1554534507,
              "_nanoseconds":0
            }
          }
        ],
       axios: {
        '$get': function(_) {
           return new Promise(function(resolve, _reject) {
             resolve([])
           })
         }
        }
      }),
      localVue
    })
    expect(mountedIndex.find('[jest="something-up"]').exists()).toBe(true)
    expect(mountedIndex.find('[jest="something-up"]').findAll('whats-up-stub').length).toBe(1)
  })

  test('Shows nothing is up when there are not things up', () => {
     const mountedIndex = shallowMount(WhatsUpList, {
      mocks: Util.mockDataStore({ uid: '123', axios: {
        '$get': function(_) {
           return new Promise(function(resolve, _reject) {
             resolve([])
           })
         }
        }
      }),
      localVue
    })
    mountedIndex.setData({ loading: false })
    expect(mountedIndex.find('[jest="nothing-up"]').exists()).toBe(true)
  })

  test('Does not show something if only I am up', () => {
    const mountedIndex = shallowMount(WhatsUpList, {
      mocks: Util.mockDataStore({ uid: 'fK0fHCRYb1QZ7NdMoqdYwgENejA2',
      whatsUp: [
          {"inviteemail":"arthur.taylor@gmail.com",
           "activity":["play","out"],
           "uid":"fK0fHCRYb1QZ7NdMoqdYwgENejA2",
           "description": "Let's do something",
           "timestamp": {
              "_seconds":1554534507,
              "_nanoseconds":0
            }
          }
        ],
       axios: {
        '$get': function(_) {
           return new Promise(function(resolve,_reject) {
             resolve([])
           })
         }
        }
      }),
      localVue
    })
    expect(mountedIndex.find('[jest="something-up"]').exists()).toBe(false)
    expect(mountedIndex.find('[jest="nothing-up"]').exists()).toBe(false)
  })
})
