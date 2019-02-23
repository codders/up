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
import DataModel from '@/models/data.js'

Vue.use(Vuetify)
Vue.use(VeeValidate, null)

describe('index.vue', () => {
  test('Shows add friend form', () => {
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockAuthStore('123')
    })
    expect(mountedForm.contains('[jest="add-friend-form"]')).toBe(true)
  }),
  test('Adding friend increases number of friends', async () => {
    Vue.config.async = true 
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockAuthStore('123')
    })
    var exists = null
    await DataModel.userFriend('123', 'alice@example.com').get().then(function (doc) {
      exists = doc.exists 
    })
    expect(exists).toBe(false)
    mountedForm.find('[data-name]').setValue('Alice')
    mountedForm.find('[data-email]').setValue('alice@example.com')
    await mountedForm.vm.submitAddFriend()
    exists = null
    await DataModel.userFriend('123', 'alice@example.com').get().then(function (doc) {
      exists = doc.exists
    })
    expect(exists).toBe(true)
    Vue.config.async = false 
  })
})
