import type { VImg } from 'vuetify/components'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import GameLogo from '~/components/GameLogo.vue'

describe('gameLogo.vue', () => {
  it('renders logo image with default width', async () => {
    const wrapper = await mountSuspended(GameLogo)
    const img = wrapper.findComponent({ name: 'VImg' })
    expect(img.exists()).toBe(true)
    expect(img.props()).toMatchObject(expect.objectContaining({ width: 120 }))
  })

  it('renders logo image with custom width', async () => {
    const wrapper = await mountSuspended(GameLogo, { props: { width: 200 } })
    const img = wrapper.findComponent({ name: 'VImg' })
    expect(img.props()).toMatchObject(expect.objectContaining({ width: 200 }))
  })

  it('does not show subtitle by default', async () => {
    const wrapper = await mountSuspended(GameLogo)
    expect(wrapper.find('.jk-game-logo--subtitle').exists()).toBe(false)
  })

  it.skip('shows subtitle when showSubtitle is true and image is loaded', async () => {
    const wrapper = await mountSuspended(GameLogo, { props: { showSubtitle: true } })
    // Simulate image loaded
    const img = wrapper.findComponent<VImg>({ name: 'VImg' })
    // await img.setData({ state: 'loaded' })
    img.vm.state = 'loaded'
    wrapper.setData({ mainImg: { state: 'loaded' } })
    await img.vm.$forceUpdate()
    await wrapper.vm.$forceUpdate()
    // console.log(img.vm.state)
    // console.log(wrapper.html())
    // Subtitle should be rendered
    expect(wrapper.find('.jk-game-logo--subtitle').exists()).toBe(true)
    expect(wrapper.find('.jk-game-logo--subtitle').text()).toBe('Das Spiel')
  })
})
