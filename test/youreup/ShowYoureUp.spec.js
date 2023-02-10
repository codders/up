import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config, createLocalVue } from '@vue/test-utils'
import Util from '@/test/utils.js'

import Index from '@/pages/youreup/_id/index.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()

config.stubs['nuxt-link'] = { template: "<div></div> "}
config.stubs['nuxt-child'] = { template: "<br/> "}

describe('youreup/_id/index.vue', () => {
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })
  test('Renders the youreup item', () => {
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({
        uid: '123',
        routeParams: { id: '123' },
        whatsUp: [
            {"inviteemail":"arthur.taylor@gmail.com",
             "activity":["play","out"],
             "uid":"fK0fHCRYb1QZ7NdMoqdYwgENejA2",
             "id": "123",
             "description": "Let's do something",
             "timestamp": {
                "_seconds":1554534507,
                "_nanoseconds":0
              }
            }
          ]
        }),
      localVue,
      vuetify
    })
    expect(mountedCard.find('[jest="youre-up-item"]').exists()).toBe(true)
  })

  test('Redirects to not found if item does not exist', () => {
    let redirectPath
    mount(Index, {
      mocks: Util.mockDataStore({
        uid: '123',
        routeParams: { id: 'abc' },
        router: {
          push(path) {
            redirectPath = path
          }
        },
        whatsUp: [
            {"inviteemail":"arthur.taylor@gmail.com",
             "activity":["play","out"],
             "uid":"fK0fHCRYb1QZ7NdMoqdYwgENejA2",
             "id": "def",
             "description": "Let's do something",
             "timestamp": {
                "_seconds":1554534507,
                "_nanoseconds":0
              }
            }
          ]
        }),
      localVue,
      vuetify
    })
    expect(redirectPath).toBe('/youreup/unknown_item')
  })
})
