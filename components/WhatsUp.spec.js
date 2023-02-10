import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount, config } from '@vue/test-utils'

import WhatsUp from '@/components/WhatsUp.vue'

Vue.use(Vuetify)
const localVue = createLocalVue()

config.stubs['router-link'] = { template: '<div></div> ' }

function formatTime(s) {
  const dtFormat = new Intl.DateTimeFormat('en-GB', {
    timeStyle: 'short',
    timeZone: 'Europe/Berlin'
  })

  return dtFormat.format(new Date(s * 1e3)).replace(':', 'h')
}

describe('WhatsUp.vue', () => {
  test('Renders activity details', async () => {
    const mounted = shallowMount(WhatsUp, {
      localVue,
    })
    await mounted.setProps({
      activity: ['out', 'move'],
      name: 'Arthur',
      uid: 'abc',
      timestamp: 1573567067,
    })
    const activityText = mounted.find(
      '.up v-list-item-content-stub v-list-item-title-stub'
    )
    const descriptionText = mounted.find(
      '.up v-list-item-content-stub v-list-item-subtitle-stub'
    )
    expect(activityText.text()).toBe(
      `${formatTime(1573567067)} - Arthur wants to\n      Go out or Move`
    )
    expect(descriptionText.exists()).toBe(false)
  })

  test('Renders activity details with description', async () => {
    const mounted = shallowMount(WhatsUp, {
      localVue,
    })
    await mounted.setProps({
      activity: ['play', 'move'],
      description: 'Play with me!',
      name: 'Arthur',
      uid: 'abc',
      timestamp: 1573567700,
    })
    const activityText = mounted.find(
      '.up v-list-item-content-stub v-list-item-title-stub'
    )
    const descriptionText = mounted.find(
      '.up v-list-item-content-stub v-list-item-subtitle-stub'
    )
    expect(activityText.text()).toBe(
      `${formatTime(1573567700)} - Arthur wants to\n      Play or Move`
    )
    expect(descriptionText.text()).toBe('Play with me!')
  })

  test('Renders activity details with description and triple select', async () => {
    const mounted = shallowMount(WhatsUp, {
      localVue,
    })
    await mounted.setProps({
      activity: ['play', 'relax', 'move'],
      name: 'Arthur',
      description: 'Play with me!',
      uid: 'abc',
      timestamp: 1571568000,
    })
    const activityText = mounted.find(
      '.up v-list-item-content-stub v-list-item-title-stub'
    )
    const descriptionText = mounted.find(
      '.up v-list-item-content-stub v-list-item-subtitle-stub'
    )
    expect(activityText.text()).toBe(
      `${formatTime(1571568000)} - Arthur wants to\n      Play, Relax or Move`
    )
    expect(descriptionText.text()).toBe('Play with me!')
  })

  test('Does not render empty description', async () => {
    const mounted = shallowMount(WhatsUp, {
      localVue,
    })
    await mounted.setProps({
      activity: ['play'],
      name: 'Arthur',
      description: '',
      uid: 'abc',
      timestamp: 1561568000,
    })
    const activityText = mounted.find(
      '.up v-list-item-content-stub v-list-item-title-stub'
    )
    const descriptionText = mounted.find(
      '.up v-list-item-content-stub v-list-item-subtitle-stub'
    )
    expect(activityText.text()).toBe('18h53 - Arthur wants to\n      Play')
    expect(descriptionText.exists()).toBe(false)
  })
})
