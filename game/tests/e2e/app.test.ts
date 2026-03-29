import { createPage, url } from '@nuxt/test-utils/e2e'
import { expect, test } from '@nuxt/test-utils/playwright'

// import { expect, it } from '@nuxt/test-utils/playwright'
// @vitest-environment nuxt
test.describe('game', async () => {
  test('screenshot main page', async ({ page, goto }, testInfo) => {
    // open main page
    await goto(url('/'), { waitUntil: 'hydration' })
    // take screenshot
    const screenshot = await page.screenshot()
    await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' })
  })

  test('play classic game', async ({ page, goto }, testInfo) => {
    // start coverage
    // await page.coverage.startJSCoverage()

    // open main page
    await goto(url('/'), { waitUntil: 'hydration' })
    // await page.screenshot({ path: `screenshot-${browserName.toString()}-${viewport?.width}x${viewport?.height}.png`, fullPage: true })
    const screenshot = await page.screenshot()
    await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' })

    // click on start a classic game button and check if start game EP was called
    const startGameResponse = page.waitForResponse(res => res.url().includes('/api/game/start') && res.status() === 200)
    await page.getByTestId('quick-game-btn').click()
    await startGameResponse

    // opens the /game page when the game is started
    await page.waitForURL('**/game')
    expect(page.url()).toContain('/game')

    // calls api to get current game data
    const getGameDateResponse = await page.waitForResponse(res => res.url().includes('/api/game') && res.status() === 200)
    const gameData = await getGameDateResponse.json()

    // check game data is valid and correctly displayed
    // check game total and currentQuestion count (classic mode are always 3 questions)
    expect(gameData.meta.currentQuestion).toBe(1)
    expect(gameData.meta.totalQuestions).toBe(3)
    const stateChipEl = page.locator('.jk-game--questions-chip')
    await expect(await stateChipEl.textContent()).toEqual('1 / 3')

    // check question
    const questionEl = page.locator('.game-question')
    await expect(questionEl).not.toBeUndefined()
    const questionText = await questionEl.textContent()
    expect(questionText?.trim()).toBe(`Frage 1 ${gameData.question.question}`)

    // save coverage as json
    // const jsCoverage = await page.coverage.stopJSCoverage()
    // const outputPath = path.join(__dirname, '../../coverage/playwright/coverage.json')
    // fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    // fs.writeFileSync(outputPath, JSON.stringify(jsCoverage))
  })

  test('creates expecting cookies', async () => {
    const page = await createPage()
    await page.goto(url('/'), { waitUntil: 'hydration' })
    await page.getByTestId('quick-game-btn').click()

    await page.waitForURL('**/game')
    expect(page.url()).toContain('/game')

    const cookies = await page.context().cookies()
    expect(cookies.find(c => c.name.includes('jannes-kann-es-questions'))).toBeTruthy()
    expect(cookies.find(c => c.name.includes('jannes-kann-es-game'))).toBeTruthy()
  })
})
