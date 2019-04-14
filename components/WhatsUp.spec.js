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
      localVue
    })
    mounted.setProps({
      activity: ['out', 'move'],
      name: 'Arthur',
      uid: 'abc'
    })
    const activityText = mounted.find('.up').find('p')
    expect(activityText.text()).toBe('Arthur wants to Go out or Move')
  }),
  test('Renders activity details with description', () => {
    const mounted = shallowMount(WhatsUp, {
      localVue
    })
    mounted.setProps({
      activity: ['play', 'move'],
      description: 'Play with me!',
      name: 'Arthur',
      uid: 'abc'
    })
    const activityText = mounted.find('.up').find('p')
    expect(activityText.text()).toBe('Arthur wants to Play or Move: "Play with me!"')
  }),
  test('Renders activity details with description and triple select', () => {
    const mounted = shallowMount(WhatsUp, {
      localVue
    })
    mounted.setProps({
      activity: ['play', 'relax', 'move'],
      name: 'Arthur',
      description: 'Play with me!',
      uid: 'abc'
    })
    const activityText = mounted.find('.up').find('p')
    expect(activityText.text()).toBe('Arthur wants to Play, Relax or Move: "Play with me!"')
  }),
  test('Does not render empty description', () => {
    const mounted = shallowMount(WhatsUp, {
      localVue
    })
    mounted.setProps({
      activity: ['play'],
      name: 'Arthur',
      description: '',
      uid: 'abc'
    })
    const activityText = mounted.find('.up').find('p')
    expect(activityText.text()).toBe('Arthur wants to Play')
  })
})
