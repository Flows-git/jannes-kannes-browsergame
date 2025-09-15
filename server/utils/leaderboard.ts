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

export async function getLeaderboard() {
  const supabase = await useSupabaseServer()
  const { data, error } = await supabase.rpc('get_leaderboard')

  if (error) {
    throw createError(error)
  }

  return data
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
