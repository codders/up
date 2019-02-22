import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Index from '@/pages/index.vue'

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
const localVue = createLocalVue()

describe('index.vue', () => {
  test('Shows login success message when logged in', () => {
    const mountedIndex = shallowMount(Index, {
      mocks: {
        $store: {
          getters: {
            activeUser: {
              uid: '123'
            }
          }
        }
      },
      localVue
    })
    expect(mountedIndex.contains('[jest="logged-in-div"]')).toBe(true)
  }),
  test('Shows login form when not logged in', () => {
    const mountedIndex = shallowMount(Index, {
      mocks: {
        $store: {
          getters: {
            activeUser: null
          }
        }
      },
      localVue
    })
    expect(mountedIndex.contains('[jest="logged-in-div"]')).toBe(false)
  })
})
