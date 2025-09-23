export default defineEventHandler(async (event) => {
  const { getGameSettings, isGameStarted } = await useGame(event)
  await isGameStarted()
  await (await useGame(event)).startGame(getGameSettings())
  return true
})
