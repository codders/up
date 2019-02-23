import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate, { Validator } from 'vee-validate'
import { mount } from '@vue/test-utils'
import mocksdk from '@/services/__mocks__/fireinit.js'

jest.mock('../services/fireinit.js', () => {
  return mocksdk
})

import Friends from '@/pages/friends.vue'

Vue.use(Vuetify)
Vue.use(VeeValidate, null)

describe('friends.vue', () => {
  test('Shows friends list', () => {
    const mountedForm = mount(Friends, {
      mocks: {
        $store: {
          getters: {
            activeUser: {
              uid: '123',
              email: 'bob@example.com',
              name: 'bob'
            }
          }
        }
      }
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
      mocks: {
        $store: {
          getters: {
            activeUser: {
              uid: '123',
              email: 'bob@example.com',
              name: 'bob'
            }
          }
        }
      }
    })
    console.log(mountedForm.vm.innerHTML)
    expect(mountedForm.find(".friend").size).toBe(2)
  })
})
