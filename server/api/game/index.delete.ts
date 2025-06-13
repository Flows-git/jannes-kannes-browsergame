export default defineEventHandler(async (event) => {
  const { isGameStarted, endGame } = await useGame(event)
  await isGameStarted()
  await endGame()
  return true
})
