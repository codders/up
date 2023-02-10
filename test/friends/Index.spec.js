import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, config, createLocalVue } from '@vue/test-utils'
import Util from '@/test/utils.js'

import Friends from '@/pages/friends/index.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()

config.stubs['nuxt-link'] = { template: '<div></div> ' }

describe('friends.vue', () => {
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  test('Does not show friends list if list is empty', () => {
    const mountedForm = mount(Friends, {
      mocks: Util.mockDataStore({ uid: '123' }),
      localVue,
      vuetify,
    })
    expect(mountedForm.find('[jest="friends-list"]').exists()).toBe(false)
  })

  test('Shows friends list if there are friends', () => {
    const friendList = [
      { uid: 'vRHbWPYcJdVbv33kopy4fNWDgwg1', name: 'Arthur' },
      { uid: 'uurGYXhegkXrW0Jy2rH4l75dxOf1', name: 'Bob' },
    ]
    const mountedForm = mount(Friends, {
      mocks: Util.mockDataStore({ uid: '123', friends: friendList }),
      localVue,
      vuetify,
    })
    expect(mountedForm.find('[jest="friends-list"]').exists()).toBe(true)
    expect(mountedForm.findAll('.friend').length).toBe(2)
    expect(mountedForm.find('.friend .name').text()).toBe('Arthur')
  })

  test('Friend list should be sorted', () => {
    const friendList = [
      { uid: 'vRHbWPYcJdVbv33kopy4fNWDgwg1', name: 'Zach' },
      { uid: 'uurGYXhegkXrW0Jy2rH4l75dxOf1', name: 'Arthur' },
    ]
    const mountedForm = mount(Friends, {
      mocks: Util.mockDataStore({ uid: '123', friends: friendList }),
      localVue,
      vuetify,
    })
    expect(mountedForm.find('[jest="friends-list"]').exists()).toBe(true)
    expect(mountedForm.findAll('.friend').length).toBe(2)
    expect(mountedForm.find('.friend .name').text()).toBe('Arthur')
  })
})
