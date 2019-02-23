import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate, { Validator } from 'vee-validate'
import { mount } from '@vue/test-utils'
import mocksdk from '@/services/__mocks__/fireinit.js'
import Util from '@/test/utils.js'

jest.mock('../services/fireinit.js', () => {
  return mocksdk
})

import Friends from '@/pages/friends.vue'

Vue.use(Vuetify)
Vue.use(VeeValidate, null)

describe('friends.vue', () => {
  test('Shows friends list', () => {
    const mountedForm = mount(Friends, {
      mocks: Util.mockAuthStore('123')
    })
    expect(mountedForm.contains('[jest="friends-list"]')).toBe(true)
  }),
  test('List shows elements for friends', async () => {
    const friendList = [
      { email: 'arthur@arthur.com', name: 'Arthur' },
      { email: 'jenny@jenny.com', name: 'Jenny' }
    ]
    for (var friend in friendList) {
      mocksdk.firestore().collection('users').doc('123').collection('friends').add(friend)
    }
    const mountedForm = mount(Friends, {
      mocks: Util.mockAuthStore('123')
    })
    console.log(mountedForm.vm)
    expect(mountedForm.find(".friend").size).toBe(2)
  })
})
