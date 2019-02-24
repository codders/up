import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate, { Validator } from 'vee-validate'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import mocksdk from '@/services/__mocks__/fireinit.js'
import Util from '@/test/utils.js'

jest.mock('../services/fireinit.js', () => {
  return mocksdk
})

import AddFriend from '@/pages/add-friend.vue'

Vue.use(Vuetify)
Vue.use(VeeValidate, null)

describe('add-friend.vue', () => {
  test('Shows add friend form', () => {
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123' })
    })
    expect(mountedForm.contains('[jest="add-friend-form"]')).toBe(true)
  }),
  test('Adding friend calls firestore', async () => {
    Vue.config.async = true
    const dispatcher = []
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123', dispatcher: dispatcher })
    })
    mountedForm.find('[data-name]').setValue('Alice')
    mountedForm.find('[data-email]').setValue('alice@example.com')
    await mountedForm.vm.submitAddFriend()
    expect(dispatcher.length).toBe(1)
    expect(dispatcher[0].method).toBe('addFriend')
    Vue.config.async = false 
  }),
  test('Redirects to /friends', async () => {
    Vue.config.async = true
    const dispatcher = []
    const router = []
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123', dispatcher: dispatcher, router: router })
    })
    mountedForm.find('[data-name]').setValue('Alice')
    mountedForm.find('[data-email]').setValue('alice@example.com')
    await mountedForm.vm.submitAddFriend()
    expect(router.length).toBe(1)
    expect(router[0].path).toBe('/friends')
    Vue.config.async = false 
  })

})
