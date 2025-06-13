export default defineEventHandler(async (event) => {
  const { getGameMeta, isGameStarted } = await useGame(event)
  await isGameStarted()
  const meta = getGameMeta()
  await (await useGame(event)).startGame({
    liveCount: meta.totalLives,
    questionCount: meta.totalQuestions,
  })
  return true
})
