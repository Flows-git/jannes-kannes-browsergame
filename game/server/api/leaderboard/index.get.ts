export default defineEventHandler(async (event) => {
  const params = getQuery<{ page?: number, perPage?: number }>(event)
  return await getLeaderboard(params)
})
