import { StatsBarHealth } from '#components'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

/**
 * Mounts the StatsBar component with the given props.
 * @param props Partial props to override the default ones.
 * @returns The mounted component.
 */
function mountStatsBar(props: Partial<InstanceType<typeof StatsBarHealth>['$props']> = {}) {
  return mountSuspended(StatsBarHealth, {
    props: { // merge default props with provided ones
      total: 0,
      remaining: 0,
      ...props,
    },
    shallow: true,
  })
}

// @vitest-environment nuxt
describe('statsBarHealth', () => {
  it('sets expected props on base StatsBar', async () => {
    const component = await mountStatsBar({ total: 42, remaining: 3 })

    const statsBar = component.findComponent({ name: 'StatsBar' })
    expect(statsBar.exists()).toBeTruthy()
    expect(statsBar.props()).toMatchObject(expect.objectContaining({ total: 42, remaining: 3, suffix: 'HP' }))
  })

  it.each([
    { percent: 100, expectedColor: '#00d00c' },
    { percent: 80, expectedColor: '#00d00c' },
    { percent: 79, expectedColor: 'warning' },
    { percent: 35, expectedColor: 'warning' },
    { percent: 34, expectedColor: 'error' },
    { percent: 0, expectedColor: 'error' },
  ])('shows $expectedColor color at $percent %% health', async ({ percent, expectedColor }) => {
    const component = await mountStatsBar({ total: 100, remaining: percent })
    const statsBar = component.findComponent({ name: 'StatsBar' })
    expect(statsBar.exists()).toBeTruthy()
    expect(statsBar.props().color).toBe(expectedColor)
  })
})
