import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import StatsBar from '~/components/StatsBar.vue'
// @vitest-environment nuxt
describe('statsBar', () => {
  it('can mount the component', async () => {
    const component = await mountSuspended(StatsBar, { props: { total: 3, remaining: 3, color: 'success' } })
    expect(component.find('.stats-bar').exists()).toBeTruthy()
  })

  it('shows correct text', async () => {
    const component = await mountSuspended(StatsBar, { props: { total: 3, remaining: 3, suffix: 'suffix', color: 'success' } })
    expect(component.text()).toBe('3 / 3 suffix')
  })
})
