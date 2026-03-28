export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  checkLeaderboardRateLimit(ip)

  const { submitGameResult } = await useGame(event)
  const { name } = await readBody<{ name: string }>(event)
  const id = await submitGameResult(name)
  const entryPage = await getLeaderboardPageById(id, 10)

  return `/leaderboard?p=${entryPage}&id=${id}`
})
