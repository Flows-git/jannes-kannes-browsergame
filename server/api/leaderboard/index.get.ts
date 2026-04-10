export default defineEventHandler(async (event) => {
  const params = getQuery<{ page?: number, perPage?: number, leaderboardId?: string }>(event)
  return await getLeaderboard({
    page: params.page,
    perPage: params.perPage,
    leaderboardId: params.leaderboardId,
  })
})
