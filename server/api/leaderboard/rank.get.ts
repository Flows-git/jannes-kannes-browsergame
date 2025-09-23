export default defineEventHandler(async (event) => {
  const { getRank, isGameStarted } = await useGame(event)
  await isGameStarted()
  return await getRank()
})
