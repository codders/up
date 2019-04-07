import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Util from '@/test/utils.js'

import WhatsUp from '@/components/WhatsUp.vue'

Vue.use(Vuetify)
const localVue = createLocalVue()

describe('WhatsUp.vue', () => {
  test('Renders activity details', () => {
    const mounted = shallowMount(WhatsUp, {
      mocks: Util.mockDataStore({
        friends: [
          { uid: 'abc', name: 'Arthur' }
        ]
      }),
      localVue
    })
    mounted.setProps({
      activity: 'out',
      uid: 'abc'
    })
    const activityText = mounted.find('.up').find('p')
    expect(activityText.text()).toBe('Arthur wants to Go out')
  }),
  test('Renders activity details with description', () => {
    const mounted = shallowMount(WhatsUp, {
      mocks: Util.mockDataStore({
        friends: [
          { uid: 'abc', name: 'Arthur' }
        ]
      }),
      localVue
    })
    mounted.setProps({
      activity: 'play',
      description: 'Play with me!',
      uid: 'abc'
    })
    const activityText = mounted.find('.up').find('p')
    expect(activityText.text()).toBe('Arthur wants to Play: "Play with me!"')
  }),
  test('Does not render empty description', () => {
    const mounted = shallowMount(WhatsUp, {
      mocks: Util.mockDataStore({
        friends: [
          { uid: 'abc', name: 'Arthur' }
        ]
      }),
      localVue
    })
    mounted.setProps({
      activity: 'play',
      description: '',
      uid: 'abc'
    })
    const activityText = mounted.find('.up').find('p')
    expect(activityText.text()).toBe('Arthur wants to Play')
  })
})
