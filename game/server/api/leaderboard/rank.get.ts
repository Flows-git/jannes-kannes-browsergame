export default defineEventHandler(async (event) => {
  const { getRank, isGameStarted } = await useGame(event)
  isGameStarted()
  return await getRank()
})
