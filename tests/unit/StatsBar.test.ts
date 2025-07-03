import { StatsBar } from '#components'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

/**
 * Mounts the StatsBar component with the given props.
 * @param props Partial props to override the default ones.
 * @returns The mounted component.
 */
function mountStatsBar(props: Partial<InstanceType<typeof StatsBar>['$props']> = {}) {
  return mountSuspended(StatsBar, {
    props: { // merge default props with provided ones
      total: 0,
      remaining: 0,
      color: '',
      ...props,
    },
    global: {
      stubs: {
        VProgressLinear: true // Stub the VProgressLinear component
      },
      renderStubDefaultSlot: true, // Ensure default slot is rendered
    },
  })
}

// @vitest-environment nuxt
describe('StatsBar', () => {

  it('can mount the component', async () => {
    const component = await mountStatsBar({ total: 3, remaining: 3, color: 'success' })
    expect(component.find('.stats-bar').exists()).toBeTruthy()
  })

  it('shows correct text', async () => {
    const component = await mountStatsBar({ total: 42, remaining: 3, suffix: 'suffix', color: 'success' })
    expect(component.text()).toBe('3 / 42 suffix')
  })

  it('sets expected props on VProgressLinear', async () => {
    const component = await mountStatsBar({
      total: 42, remaining: 3, height: 42, color: 'success'
    })

    const progressBar = component.findComponent({ name: 'VProgressLinear' })
    expect(progressBar.exists()).toBeTruthy()
    expect(progressBar.props()).toMatchObject(expect.objectContaining({ color: 'success', max: 42, modelValue: 3, height: 42 }))
  })
})
