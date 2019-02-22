import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate, { Validator } from 'vee-validate'
import { mount } from '@vue/test-utils'
import AddFriend from '@/pages/add-friend.vue'
import flushPromises from 'flush-promises'
import mocksdk from '@/services/__mocks__/fireinit.js'

jest.mock('../services/fireinit.js')

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
    await mocksdk.firestore().collection('users').doc('bob@example.com').collection('friends').doc('alice@example.com').get().then(function (doc) {
      exists = doc.exists 
    })
    expect(exists).toBe(false)
    mountedForm.find('[data-name]').setValue('Alice')
    mountedForm.find('[data-email]').setValue('alice@example.com')
    await mountedForm.vm.submitAddFriend()
    exists = null
    await mocksdk.firestore().collection('users').doc('bob@example.com').collection('friends').doc('alice@example.com').get().then(function (doc) {
      exists = doc.exists
    })
    expect(exists).toBe(true)
    Vue.config.async = false 
  })
})
