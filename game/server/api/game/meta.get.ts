export default defineEventHandler(async (event) => {
  const { getGameMeta, isGameStarted } = await useGame(event)
  isGameStarted()
  return await getGameMeta()
})
