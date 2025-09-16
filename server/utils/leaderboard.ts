export async function submitGameResultToLeaderboard(name: string, data: GameSession) {
  const supabase = await useSupabaseServer()
  if (data.running) {
    throw createError('game not ended')
  }

  const entry: LeaderboardEntry = {
    name,
    score: data.correctAnswers,
    correctAnswers: data.correctAnswers,
    usedJoker: 0,
    gameTime: data.gameTime as string,
    averageAnswerTime: data.averageAnswerTime,
  }

  await supabase.from('leaderboard').insert(entry)
}

export async function getLeaderboard(params?: { page?: number, perPage?: number }) {
  const supabase = await useSupabaseServer()

  const perPage = Number(params?.perPage ?? 99999999)
  const from = Number(((params?.page ?? 1) - 1) * perPage)
  const to = from + perPage - 1

  const { data, error } = await supabase.from('leaderboard_with_rank').select('*').order('position').range(from, to)
  const { count } = await supabase.from('leaderboard').select('id', { count: 'exact', head: true })

  if (error) {
    throw createError(error)
  }

  return {
    items: data,
    meta: {
      totalCount: count,
      from,
      to: from + perPage - 1,
    },
  }
}

export async function getLeaderboardRanking(data: GameSession) {
  const supabase = await useSupabaseServer()

  return await supabase.rpc('get_rank', { _score: data.correctAnswers })
}

/**
 *
 * SELECT SUM(cnt - 1) AS reduce_same_rank
FROM (
    SELECT score, COUNT(*) AS cnt
    FROM leaderboard
    WHERE SCORE > number
    GROUP BY score
    HAVING COUNT(*) > 1
) t;
 */
