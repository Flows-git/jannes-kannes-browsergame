export default defineEventHandler(async (event) => {
  const { getGameSettings, isGameStarted, startGame } = await useGame(event)
  isGameStarted()
  await startGame(getGameSettings())
  return true
})
