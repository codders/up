import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config } from '@vue/test-utils'
import Util from '@/test/utils.js'

import Index from '@/pages/friends/_id/index.vue'

Vue.use(Vuetify)

config.stubs['nuxt-link'] = '<a><slot /></a>'
config.stubs['nuxt-child'] = '<br />'

describe('friends/_id/index.vue', () => {
  test('Renders the whatsup item', () => {
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({
        uid: '123',
        routeParams: { id: 'abc' },
        friends: {
          abc: {
            uid: 'abc'
          }
        }
      })
    })
    expect(mountedCard.find('[jest="friend-name"]').text()).toBe('robert')
  }),
  test('Redirects to not found if friend does not exist', () => {
    var redirectPath = undefined
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({
        uid: '123',
        routeParams: { id: 'abc' },
        router: {
          push(path) {
            redirectPath = path
          }
        }
      })
    })
    expect(redirectPath).toBe('/friends/unknown_friend')
  })
})
