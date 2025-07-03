import { StatsBarMana } from '#components'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

/**
 * Mounts the StatsBar component with the given props.
 * @param props Partial props to override the default ones.
 * @returns The mounted component.
 */
function mountStatsBar(props: Partial<InstanceType<typeof StatsBarMana>['$props']> = {}) {
  return mountSuspended(StatsBarMana, {
    props: { // merge default props with provided ones
      total: 0,
      remaining: 0,
      ...props
    },
    shallow: true
  })
}

// @vitest-environment nuxt
describe('StatsBarMana', () => {
  it('sets expected props on base StatsBar', async () => {
    const component = await mountStatsBar({ total: 42, remaining: 3 })
    const statsBar = component.findComponent({ name: 'StatsBar' })
    expect(statsBar.exists()).toBeTruthy()
    expect(statsBar.props()).toMatchObject(expect.objectContaining({ total: 42, remaining: 3, suffix: 'Mana', color: '#4792d5' }))
  })
})