import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config } from '@vue/test-utils'
import Util from '@/test/utils.js'

import Index from '@/pages/invite/_id/index.vue'

Vue.use(Vuetify)

config.stubs['nuxt-link'] = { template: '<div></div> ' }
config.stubs['nuxt-child'] = { template: '<br />' }

describe('invite/_id/index.vue', () => {
  test('Renders the invitation when not logged in', async () => {
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({
        routeParams: { id: 'abc' },
      }),
    })
    await mountedCard.setData({
      inviterName: 'Arthur',
      email: 'arthur@example.com',
    })
    expect(mountedCard.find('[jest="inviter-name"]').text()).toBe(
      'Arthur invited you to join up!'
    )
    expect(mountedCard.find('[jest="email-mismatch"]').exists()).toBe(false)
  })

  test('Shows error if invite is intended for a different user', () => {
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({
        uid: 'abc',
        routeParams: { id: 'abc' },
        profile: { email: 'sam@example.com' },
      }),
    })
    mountedCard.setData({
      inviterName: 'Arthur',
      email: 'arthur@example.com',
    })
    expect(mountedCard.find('[jest="email-mismatch"]').exists()).toBe(true)
  })

  test('Renders the login form if not logged in', () => {
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({
        routeParams: { id: 'abc' },
      }),
    })
    mountedCard.setData({
      inviterName: 'Arthur',
      email: 'arthur@example.com',
    })
    expect(mountedCard.find('[jest="login"]').exists()).toBe(true)
  })

  test('Does not render login form if logged in', () => {
    const mountedCard = mount(Index, {
      mocks: Util.mockDataStore({
        uid: 'abc',
        routeParams: { id: 'abc' },
      }),
    })
    mountedCard.setData({
      inviterName: 'Arthur',
      email: 'arthur@example.com',
    })
    expect(mountedCard.find('[jest="login]').exists()).toBe(false)
  })

  test('Redirects to welcome page if invite accepted', () => {
    let redirectPath
    mount(Index, {
      mocks: Util.mockDataStore({
        routeParams: { id: 'abc' },
        router: {
          push(path) {
            redirectPath = path
          },
        },
      }),
      data: function () {
        return {
          inviterName: 'Arthur',
          email: 'arthur@example.com',
          accepted: true,
        }
      },
    })
    expect(redirectPath).toBe('/')
  })

  test('Redirects to not found if invite does not exist', () => {
    let redirectPath
    mount(Index, {
      mocks: Util.mockDataStore({
        routeParams: { id: 'abc' },
        router: {
          push(path) {
            redirectPath = path
          },
        },
      }),
    })
    expect(redirectPath).toBe('/invite/unknown_invite')
  })
})
