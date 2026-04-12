export default defineEventHandler(async (event): Promise<LeaderboardSubmitResponse> => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  checkLeaderboardRateLimit(ip)

  const { submitGameResult } = await useGame(event)
  const { name } = await readBody<{ name: string }>(event)
  try {
    const { id, rank } = await submitGameResult(name)
    const entryPage = await getLeaderboardPageById(id, 10)

    if (rank <= 3) {
      setCookie(event, 'jannes-kann-es-show-confetti', 'true', { maxAge: 60 })
    }

    return {
      ok: true,
      redirect: `/leaderboard?p=${entryPage}`,
      leaderboardId: id,
    }
  }
  catch (e) {
    const err = e as { statusCode?: number, statusMessage?: string, data?: { name: string, score: number, gameTime: string } }
    if (err?.statusCode === 409 && err.statusMessage === 'not_better' && err.data) {
      return {
        ok: false,
        reason: 'not_better',
        existing: err.data,
      }
    }
    throw e
  }
})
