export default defineEventHandler(async (event) => {
  const params = getQuery<{ page?: number, perPage?: number }>(event)
  const body = await readBody<{ leaderboardId?: string }>(event)

  return await getLeaderboard({
    page: params.page,
    perPage: params.perPage,
    leaderboardId: body.leaderboardId,
  }).then((result) => {
    return {
      ...result,
      items: result.items.map(entry => ({ ...entry, averageAnswerTime: parseTimeToString(entry.averageAnswerTime), gameTime: parseTimeToString(entry.gameTime) })),
    }
  })
})
