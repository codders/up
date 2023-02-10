import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config, createLocalVue } from '@vue/test-utils'
import Util from '@/test/utils.js'

import Index from '@/pages/friends/_id/index.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()

config.stubs['nuxt-link'] = { template: '<div></div> ' }
config.stubs['nuxt-child'] = { template: '<br/>' }

describe('friends/_id/index.vue', () => {
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  test('Renders the whatsup item', () => {
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({
        uid: '123',
        routeParams: { id: 'abc' },
        friends: [
          {
            uid: 'abc',
            name: 'Arthur',
          },
        ],
      }),
      vuetify,
      localVue,
    })
    expect(mountedCard.find('[jest="friend-name"]').text()).toBe('Arthur')
  })

  test('Redirects to not found if friend does not exist', () => {
    let redirectPath
    mount(Index, {
      mocks: Util.mockDataStore({
        uid: '123',
        routeParams: { id: 'abc' },
        router: {
          push(path) {
            redirectPath = path
          },
        },
      }),
      vuetify,
      localVue,
    })
    expect(redirectPath).toBe('/friends/unknown_friend')
  })
})
