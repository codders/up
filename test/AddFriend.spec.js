import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate, { Validator } from 'vee-validate'
import { mount, config } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Util from '@/test/utils.js'

import AddFriend from '@/pages/add-friend.vue'

Vue.use(Vuetify)
Vue.use(VeeValidate, null)

config.stubs['nuxt-link'] = '<a><slot /></a>'

describe('add-friend.vue', () => {
  test('Shows directory listing', () => {
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123' })
    })
    mountedForm.setData({
      directoryEntries: [
        { uid: 'abc', name: 'Arthur' },
        { uid: 'def', name: 'Jenny' }
      ]
    })
    expect(mountedForm.contains('[jest="directory-listing"]')).toBe(true)
  }),
  test('Does not show directory listing for empty directory', () => {
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123' })
    })
    expect(mountedForm.contains('[jest="directory-listing"]')).toBe(false)
  }),
  test('Entries shown matches directory size', () => {
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123' })
    })
    mountedForm.setData({
      directoryEntries: [
        { uid: 'abc', name: 'Arthur' },
        { uid: 'def', name: 'Jenny' }
      ]
    })
    expect(mountedForm.findAll('.entry').length).toBe(2)
  }),
  test('Entries are sorted by name', () => {
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123' })
    })
    mountedForm.setData({
      directoryEntries: [
        { uid: 'abc', name: 'Zach' },
        { uid: 'def', name: 'Arthur' }
      ]
    })
    expect(mountedForm.findAll('.entry').length).toBe(2)
    expect(mountedForm.find('.entry').find('.v-list-item__title').text()).toBe('Arthur')
  }),
  test('It should submit email when add-friend-by-email is clicked', () => {
    const dispatcher = []
    const dispatcherPromises = {
      addFriendByEmail: Promise.resolve()
    }
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123', dispatcher, dispatcherPromises })
    })
    mountedForm.setData({
      email: 'test@example.com'
    })
    mountedForm.vm.addFriendByEmail()
    expect(dispatcher.length).toBe(1)
    expect(dispatcher[0].method).toBe('addFriendByEmail')
  }),
  test('It should disable input while request is in flight', done => {
    const dispatcher = []
    let resolver = null
    const dispatcherPromises = {
      addFriendByEmail: new Promise((resolve, reject) => {
        resolver = resolve
      })
    }
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123', dispatcher, dispatcherPromises })
    })
    mountedForm.setData({
      email: 'test@example.com'
    })
    expect(mountedForm.vm.inputEnabled).toBe(true)
    mountedForm.vm.addFriendByEmail()
    expect(dispatcher.length).toBe(1)
    expect(dispatcher[0].method).toBe('addFriendByEmail')
    expect(mountedForm.vm.inputEnabled).toBe(false)
    resolver()
    mountedForm.vm.$nextTick().then(() => {
      expect(mountedForm.vm.inputEnabled).toBe(true)
      done()
    })
  }),
  test('It should show invite user option if request fails with 404', done => {
    const dispatcher = []
    let rejecter = null
    const addEmailPromise = new Promise((resolve, reject) => {
      rejecter = reject
    })
    const dispatcherPromises = {
      addFriendByEmail: addEmailPromise
    }
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123', dispatcher, dispatcherPromises })
    })
    mountedForm.setData({
      email: 'test@example.com'
    })
    expect(mountedForm.vm.inputEnabled).toBe(true)
    expect(mountedForm.vm.showInvite).toBe(false)
    mountedForm.vm.addFriendByEmail()
    expect(dispatcher.length).toBe(1)
    expect(dispatcher[0].method).toBe('addFriendByEmail')
    expect(mountedForm.vm.inputEnabled).toBe(false)
    rejecter({
      response: {
        data: {
          code: 'NOT_FOUND'
        }
      }
    })
    addEmailPromise.catch(err => {
      mountedForm.vm.$nextTick().then(() => {
        expect(mountedForm.vm.inputEnabled).toBe(false)
        expect(mountedForm.vm.showInvite).toBe(true)
        done()
      })
    })
  }),
  test('It should show error if request fails with another error', done => {
    const dispatcher = []
    let rejecter = null
    const addEmailPromise = new Promise((resolve, reject) => {
      rejecter = reject
    })
    const dispatcherPromises = {
      addFriendByEmail: addEmailPromise
    }
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123', dispatcher, dispatcherPromises })
    })
    mountedForm.setData({
      email: 'test@example.com'
    })
    expect(mountedForm.vm.inputEnabled).toBe(true)
    expect(mountedForm.vm.showInvite).toBe(false)
    mountedForm.vm.addFriendByEmail()
    expect(dispatcher.length).toBe(1)
    expect(dispatcher[0].method).toBe('addFriendByEmail')
    expect(mountedForm.vm.inputEnabled).toBe(false)
    rejecter({
      message: 'Error Message',
      response: {
        data: {
          code: 'ANOTHER_ERROR'
        }
      }
    })
    addEmailPromise.catch(err => {
      mountedForm.vm.$nextTick().then(() => {
        expect(mountedForm.vm.inputEnabled).toBe(true)
        expect(mountedForm.vm.showInvite).toBe(false)
        expect(mountedForm.vm.addFriendError).toBe('Error Message')
        done()
      })
    })
  }),
  test('It should disable input while invite is sent and restore when done', done => {
    const dispatcher = []
    let resolver = null
    const sendInvitePromise = new Promise((resolve, reject) => {
      resolver = resolve
    })
    const dispatcherPromises = {
      inviteFriendByEmail: sendInvitePromise
    }
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123', dispatcher, dispatcherPromises })
    })
    mountedForm.setData({
      email: 'test@example.com',
      showInvite: true,
      inputEnabled: false,
      sendInviteEnabled: true
    })
    mountedForm.vm.sendInvite()
    expect(dispatcher.length).toBe(1)
    expect(dispatcher[0].method).toBe('inviteFriendByEmail')
    expect(mountedForm.vm.sendInviteEnabled).toBe(false)
    resolver({
      message: 'Invite Sent',
    })
    mountedForm.vm.$nextTick().then(() => {
      expect(mountedForm.vm.inputEnabled).toBe(true)
      expect(mountedForm.vm.showInvite).toBe(false)
      expect(mountedForm.vm.sendInviteEnabled).toBe(true)
      expect(mountedForm.vm.addFriendError).toBe(null)
      expect(mountedForm.vm.email).toBe('')
      done()
    })
  }),
  test('It should hide the invite and enable input if edit addess is selected', () => {
    const mountedForm = mount(AddFriend, {
      mocks: Util.mockDataStore({ uid: '123' })
    })
    mountedForm.setData({
      email: 'test@example.com',
      showInvite: true,
      inputEnabled: false,
      sendInviteEnabled: true
    })
    mountedForm.vm.editAddress()
    expect(mountedForm.vm.inputEnabled).toBe(true)
    expect(mountedForm.vm.showInvite).toBe(false)
    expect(mountedForm.vm.sendInviteEnabled).toBe(true)
    expect(mountedForm.vm.addFriendError).toBe(null)
    expect(mountedForm.vm.email).toBe('test@example.com')
  })
})
