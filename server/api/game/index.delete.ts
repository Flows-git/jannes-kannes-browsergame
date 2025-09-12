export default defineEventHandler(async (event) => {
  const { isGameStarted, endGame, getGameMeta } = await useGame(event)
  await isGameStarted()
  await endGame()
  return {
    meta: await getGameMeta(),
  }
})
