const VALID_NAME_PATTERN = /^[\p{L}\p{N}\s._-]+$/u

export async function submitGameResultToLeaderboard(name: string, data: GameSession) {
  const supabase = useSupabaseServer()
  validateGameResult(name, data)
  const entry: LeaderboardEntry = {
    name: name.trim(),
    score: data.correctAnswers,
    correctAnswers: data.correctAnswers,
    usedJoker: 0,
    gameTime: data.gameTime as string,
    averageAnswerTime: data.averageAnswerTime,
  }

  const { data: _newEntry } = await supabase.from('leaderboard').insert(entry).select('id').single()
  return _newEntry?.id
}

function validateGameResult(name: string, data: GameSession) {
  if (data.running) {
    throw createError('game not ended')
  }

  if (data.gameMode !== 'ranked') {
    throw createError('only ranked games permitted')
  }

  // Name validation
  const trimmedName = name.trim()
  if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 30) {
    throw createError({ status: 400, statusMessage: 'Name must be 3-30 characters' })
  }
  if (!VALID_NAME_PATTERN.test(trimmedName)) {
    throw createError({ status: 400, statusMessage: 'Name contains invalid characters' })
  }

  // Timing validation — minimum 2s per answered question
  if (!data.startTime || !data.endTime || data.endTime <= data.startTime) {
    throw createError({ status: 400, statusMessage: 'Invalid game timing' })
  }
  const gameDurationMs = data.endTime - data.startTime
  const minDurationMs = data.answeredQuestions * 3000
  if (gameDurationMs < minDurationMs) {
    throw createError({ status: 400, statusMessage: 'Game completed too quickly' })
  }

  // Game state integrity checks
  if (data.correctAnswers > data.answeredQuestions) {
    throw createError({ status: 400, statusMessage: 'Invalid game state' })
  }
  if (data.answeredQuestions > data.totalQuestions) {
    throw createError({ status: 400, statusMessage: 'Invalid game state' })
  }

  if (data.correctAnswers < 3) {
    throw createError({ status: 400, statusMessage: 'Minimun 3 correct answers required to be qualified for a leaderboard entry' })
  }
}

export async function getLeaderboard(params?: { page?: number, perPage?: number }) {
  const supabase = useSupabaseServer()

  const perPage = Number(params?.perPage ?? 99999999)
  const from = Number(((params?.page ?? 1) - 1) * perPage)
  const to = from + perPage - 1

  const { data, error } = await supabase.from('leaderboard_with_rank').select('*').order('position').range(from, to).overrideTypes<LeaderboardListEntry[]>()
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

export async function getLeaderboardPageById(id: number, perPage: number) {
  const supabase = useSupabaseServer()

  const { data, error } = await supabase.from('leaderboard_with_rank').select('position').eq('id', id).single().overrideTypes<LeaderboardListEntry>()

  if (error) {
    throw createError(error)
  }

  if (data) {
    return Math.floor((data.position - 1) / Number(perPage) + 1)
  }
}

export async function getLeaderboardRanking(score: number) {
  const supabase = useSupabaseServer()

  const { data, error } = await supabase.rpc('get_rank', { _score: score })

  if (error) {
    throw createError(error)
  }

  return data
}
