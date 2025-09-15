export default defineEventHandler(async (event) => {
  const { getRank } = await useGame(event)
  return await getRank()
})
