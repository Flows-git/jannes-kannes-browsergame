export default defineEventHandler(async (event) => {
  const { getGameResult } = await useGame(event)
  return await getGameResult()
})
