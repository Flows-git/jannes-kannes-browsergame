export default defineEventHandler(async (event) => {
  const params = await getQuery<{ page?: number, perPage?: number }>(event)
  return await getLeaderboard(params)
})
