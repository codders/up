import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate, { Validator } from 'vee-validate'
import { mount } from '@vue/test-utils'
import AddFriend from '@/pages/add-friend.vue'
import flushPromises from 'flush-promises'

var firebasemock    = require('firebase-mock')

var mockauth = new firebasemock.MockAuthentication()
var mockfirestore = new firebasemock.MockFirestore()

var mocksdk = new firebasemock.MockFirebaseSdk(
  // use null if your code does not use RTDB
  (path) => {
    return null
  },
  // use null if your code does not use AUTHENTICATION
  () => {
    return mockauth
  },
  // use null if your code does not use FIRESTORE
  () => {
    return mockfirestore
  },
  // use null if your code does not use STORAGE
  () => {
    return null
  },
  // use null if your code does not use MESSAGING
  () => {
    return null
  }
);

jest.mock('../services/fireinit.js', () => {
  return mocksdk
})


Vue.use(Vuetify)
Vue.use(VeeValidate, null)
// const localVue = createLocalVue()

describe('index.vue', () => {
  test('Shows add friend form', () => {
//    const mountedForm = shallowMount(AddFriend, {
//      localVue
//    })
    const mountedForm = mount(AddFriend, {
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
    expect(mountedForm.contains('[jest="add-friend-form"]')).toBe(true)
  }),
  test('Adding friend increases number of friends', async () => {
    Vue.config.async = true 
    const mountedForm = mount(AddFriend)
    var exists = null
    mocksdk.firestore().collection('users').doc('bob@example.com').collection('friends').doc('alice@example.com').get().then(function(doc) {
      exists = doc.exists
      console.log("Got doc: " + doc)
    })
    await flushPromises()
    expect(exists).toBe(false)
    mountedForm.find('[data-name]').setValue('Alice')
    mountedForm.find('[data-email]').setValue('alice@example.com')
    mountedForm.vm.submitAddFriend()
    Vue.config.async = false 
  })
})
