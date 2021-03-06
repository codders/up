import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount, config } from '@vue/test-utils'
import Util from '@/test/utils.js'

import WhatsUp from '@/components/WhatsUp.vue'

Vue.use(Vuetify)
const localVue = createLocalVue()

config.stubs['router-link'] = '<a><slot /></a>'

describe('WhatsUp.vue', () => {
  test('Renders activity details', () => {
    const mounted = shallowMount(WhatsUp, {
      localVue
    })
    mounted.setProps({
      activity: ['out', 'move'],
      name: 'Arthur',
      uid: 'abc',
      timestamp: 1573567067
    })
    const activityText = mounted.find('.up v-list-item-content-stub v-list-item-title-stub')
    const descriptionText = mounted.find('.up v-list-item-content-stub v-list-item-subtitle-stub')
    expect(activityText.text()).toBe("14h57 - Arthur wants to\n      Go out or Move")
    expect(descriptionText.exists()).toBe(false)
  }),
  test('Renders activity details with description', () => {
    const mounted = shallowMount(WhatsUp, {
      localVue
    })
    mounted.setProps({
      activity: ['play', 'move'],
      description: 'Play with me!',
      name: 'Arthur',
      uid: 'abc',
      timestamp: 1573567700
    })
    const activityText = mounted.find('.up v-list-item-content-stub v-list-item-title-stub')
    const descriptionText = mounted.find('.up v-list-item-content-stub v-list-item-subtitle-stub')
    expect(activityText.text()).toBe('15h08 - Arthur wants to\n      Play or Move')
    expect(descriptionText.text()).toBe('Play with me!')
  }),
  test('Renders activity details with description and triple select', () => {
    const mounted = shallowMount(WhatsUp, {
      localVue
    })
    mounted.setProps({
      activity: ['play', 'relax', 'move'],
      name: 'Arthur',
      description: 'Play with me!',
      uid: 'abc',
      timestamp: 1571568000
    })
    const activityText = mounted.find('.up v-list-item-content-stub v-list-item-title-stub')
    const descriptionText = mounted.find('.up v-list-item-content-stub v-list-item-subtitle-stub')
    expect(activityText.text()).toBe('12h40 - Arthur wants to\n      Play, Relax or Move')
    expect(descriptionText.text()).toBe('Play with me!')
  }),
  test('Does not render empty description', () => {
    const mounted = shallowMount(WhatsUp, {
      localVue
    })
    mounted.setProps({
      activity: ['play'],
      name: 'Arthur',
      description: '',
      uid: 'abc',
      timestamp: 1561568000
    })
    const activityText = mounted.find('.up v-list-item-content-stub v-list-item-title-stub')
    const descriptionText = mounted.find('.up v-list-item-content-stub v-list-item-subtitle-stub')
    expect(activityText.text()).toBe('18h53 - Arthur wants to\n      Play')
    expect(descriptionText.exists()).toBe(false)
  })
})
