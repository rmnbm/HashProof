import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          // Render the link content so the brand title is visible.
          RouterLink: { template: '<a><slot /></a>' },
          RouterView: true,
        },
      },
    })

    expect(wrapper.text()).toContain('HashProof')
  })
})
