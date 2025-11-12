import { GameResultScreenRank } from '#components'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

/**
 * Mounts the StatsBar component with the given props.
 * @param props Partial props to override the default ones.
 * @returns The mounted component.
 */
function mountGameResultScreenRank(
  _: Partial<InstanceType<typeof GameResultScreenRank>['$props']> = {},
) {
  return mountSuspended(GameResultScreenRank, {
    shallow: true,
    global: {
      stubs: {
        default: (name: string) => !name.startsWith('v-'),
      },
      renderStubDefaultSlot: true,
    },
  })
}

// @vitest-environment nuxt
describe('gameResultScreenRank', () => {
  it('fetches reached rank', async () => {
    const fetch = vi
      .spyOn(globalThis, '$fetch')
      .mockImplementationOnce(() => Promise.resolve(42))
    await mountGameResultScreenRank()
    expect(fetch).toHaveBeenCalledWith('/api/leaderboard/rank')
  })

  it('shows reached rank', async () => {
    vi.stubGlobal('$fetch', () => Promise.resolve(42))
    const wrapper = await mountGameResultScreenRank()

    expect(wrapper.find('.rank').text()).toContain('42')
  })

  it('shows error when fetching rank fails', async () => {
    const fetch = vi
      .spyOn(globalThis, '$fetch')
      .mockImplementationOnce(() =>
        Promise.reject(new Error('Failed to fetch')),
      )
    const wrapper = await mountGameResultScreenRank()
    expect(fetch).toHaveBeenCalledWith('/api/leaderboard/rank')
    expect(wrapper.find('.rank-fetch-error').text()).toContain(
      'Failed to fetch',
    )
  })
})

// mount + shallowMount
/*
  // Example of mocking a composable
  const useGame = {
    start: jest.fn()
  }

  const wrapper = mount(Component, {
    global: {
      mocks: {
        useGame
      }
    }
  })
  expect(useGame.start).toHaveBeenCalledWith('blubber')
 */
