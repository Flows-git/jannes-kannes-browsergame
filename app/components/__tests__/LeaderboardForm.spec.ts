import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import LeaderboardForm from '~/components/LeaderboardForm.vue'

// @vitest-environment nuxt
describe('test LeaderboardForm', () => {
  it('should submit the correct username', async () => {
    const fetch = vi
      .spyOn(globalThis, '$fetch')
      .mockImplementation(() => Promise.resolve('/url/to/leaderboard'))

    // const { useRouterMock } = vi.hoisted(() => {
    //   return {
    //     useRouterMock: vi.fn(),
    //   }
    // })

    // mockNuxtImport('useRouter', () => {
    //   return () => ({ replace: useRouterMock })
    // })

    const wrapper = await mountSuspended(LeaderboardForm)
    await wrapper.findComponent('.v-text-field.name').setValue('Flo')
    await wrapper.trigger('submit')

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      '/api/leaderboard',
      expect.objectContaining({
        method: 'POST',
        body: {
          name: 'Flo',
        },
      }),
    )

    // expect(useRouterMock).toHaveBeenCalledWith('/url/to/leaderboard')
  })

  it('should not submit when no username is set', async () => {
    const fetch = vi
      .spyOn(globalThis, '$fetch')
      .mockImplementation(() => Promise.resolve('/url/to/leaderboard'))
    const mockReplace = vi.fn()
    vi.stubGlobal('useRouter', () => ({
      replace: mockReplace,
    }))
    const wrapper = await mountSuspended(LeaderboardForm)

    await wrapper.trigger('submit')

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(fetch).toHaveBeenCalledTimes(0)
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
