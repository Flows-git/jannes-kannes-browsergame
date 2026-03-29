export default defineEventHandler(async (event) => {
  const { isGameStarted, endGame, getGameMeta } = await useGame(event)
  isGameStarted()
  await endGame()
  return {
    meta: await getGameMeta(),
  }
})
