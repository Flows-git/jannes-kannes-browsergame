export default defineEventHandler(async (event) => {
  const { id, perPage } = await getQuery<{ perPage: number, id: number }>(event)
  return await getLeaderboardPageById(id, perPage)
})
