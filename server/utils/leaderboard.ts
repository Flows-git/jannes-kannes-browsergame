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
  const { data, error } = await supabase.from('leaderboard').select().order('score', { ascending: false })

  if (error) {
    throw createError(error)
  }

  let rank = 1
  data.forEach((item, index) => {
    const lastScore = index > 0 ? data[index - 1] : data[index]
    if (lastScore.score !== item.score) {
      rank++
    }
    item.rank = rank
  })

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
