import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config } from '@vue/test-utils'
import Util from '@/test/utils.js'

import Index from '@/pages/whatsup/index.vue'

Vue.use(Vuetify)

config.stubs['router-link'] = '<a><slot /></a>'
config.stubs['nuxt-link'] = '<a><slot /></a>'
config.stubs['nuxt-child'] = '<br />'

describe('whatsup/index.vue', () => {
  test('Shows a list of whatsup', () => {
    const mountedIndex = mount(Index, {
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
        '$get': function(request) {
           return new Promise(function(rs,rj) {
             rs([])
           })
         }
        }
      })
    })
    expect(mountedIndex.contains('[jest="something-up"]')).toBe(true)
    expect(mountedIndex.find('[jest="something-up"]').find('div.v-list').findAll('.v-list-item').length).toBe(1)
  })
})
