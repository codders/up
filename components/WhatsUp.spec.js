import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import WhatsUp from '@/components/WhatsUp.vue'

Vue.use(Vuetify)
const localVue = createLocalVue()

describe('WhatsUp.vue', () => {
  test('Renders activity details', () => {
    const mounted = shallowMount(WhatsUp, {
      localVue
    })
    mounted.setProps({
      activity: 'eat',
      email: 'arthur@email.com'
    })
    const activityText = mounted.find('.up').find('p')
    expect(activityText.text()).toBe('arthur@email.com wants to eat')
  })
})
