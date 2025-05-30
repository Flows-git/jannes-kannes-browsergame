export default defineEventHandler(async (event) => {
  const { getGameMeta, isGameStarted } = await useGame(event)
  await isGameStarted()
  return getGameMeta()
})
