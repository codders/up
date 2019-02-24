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
  test('Does not show friends list if list is empty', () => {
    const mountedForm = mount(Friends, {
      mocks: Util.mockAuthStore('123')
    })
    expect(mountedForm.contains('[jest="friends-list"]')).toBe(false)
  }),
  test('Shows friends list if there are friends', () => {
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
    const authStore = Util.authStore('123')
    const mountedForm = mount(Friends, {
      mocks: Util.mockWithStore(authStore)
    })
    
    const loadedData = mountedForm.vm.$options.asyncData({ store: authStore })
    await loadedData
    console.log("Loaded Data:", loadedData.friends)

    expect(mountedForm.findAll(".friend").length).toBe(2)
  })
})
