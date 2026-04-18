const VALID_NAME_PATTERN = /^[\p{L}\p{N}\s._-]+$/u
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidLeaderboardId(leaderboardId: string | undefined): leaderboardId is string {
  return !!leaderboardId && UUID_PATTERN.test(leaderboardId)
}

export function isNewResultBetter(
  existing: { score: number, gameTime: number },
  candidate: { score: number, gameTime: number },
): boolean {
  if (candidate.score > existing.score) {
    return true
  }
  if (candidate.score === existing.score) {
    return candidate.gameTime < existing.gameTime
  }
  return false
}

export async function getLeaderboardEntryById(id: string) {
  const supabase = useSupabaseServer()
  const { data, error } = await supabase
    .from('leaderboard_with_rank')
    .select()
    .eq('id', id)
    .maybeSingle<LeaderboardEntry>()

  if (error) {
    throw createError(error)
  }
  return data
}

export async function submitGameResultToLeaderboard(name: string, data: GameSession) {
  validateGameResult(name, data)
  const entry: LeaderboardEntry = {
    name: name.trim(),
    score: data.correctAnswers,
    correctAnswers: data.correctAnswers,
    usedJoker: 0,
    gameTime: data.gameTime,
    averageAnswerTime: getAverageAnswerTime(data),
    count: 1,
  }

  if (isValidLeaderboardId(data.leaderboardId)) {
    const existing = await getLeaderboardEntryById(data.leaderboardId)
    if (existing && !isNewResultBetter(existing, { score: entry.score, gameTime: entry.gameTime })) {
      throw createError({
        status: 409,
        statusMessage: 'not_better',
        data: {
          name: existing.name,
          score: existing.score,
          gameTime: existing.gameTime,
        },
      })
    }
    if (existing) {
      entry.count = existing.count + 1
      return await updateLeaderboardEntry(entry, data.leaderboardId)
    }
  }
  return await createLeaderboardEntry(entry)
}

async function createLeaderboardEntry(entry: LeaderboardEntry) {
  const supabase = useSupabaseServer()
  const { data, error } = await supabase.from('leaderboard').insert(entry).select('id').single().overrideTypes<{ id: string }>()
  if (error) {
    throw createError(error)
  }
  return data.id
}

async function updateLeaderboardEntry(entry: LeaderboardEntry, id: string) {
  const supabase = useSupabaseServer()
  const { data, error } = await supabase.from('leaderboard').update({ ...entry, updated_at: new Date().toISOString() }).select('id').eq('id', id).single().overrideTypes<{ id: string }>()
  if (error) {
    throw createError(error)
  }
  return data.id
}

function validateGameResult(name: string, data: GameSession) {
  const config = useRuntimeConfig()

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

  if (data.correctAnswers < config.public.leaderboardMinCorrectAnswers) {
    throw createError({ status: 400, statusMessage: `Minimun ${config.public.leaderboardMinCorrectAnswers} correct answers required to be qualified for a leaderboard entry` })
  }
}

export async function getLeaderboard(params?: { page?: number, perPage?: number, leaderboardId?: string }) {
  const supabase = useSupabaseServer()

  const perPage = Number(params?.perPage ?? 99999999)
  const from = Number(((params?.page ?? 1) - 1) * perPage)
  const to = from + perPage - 1

  const { data, error } = await supabase.from('leaderboard_with_rank').select('id, rank, position, name, score, gameTime, averageAnswerTime').order('position').range(from, to).overrideTypes<LeaderboardListEntry[]>()
  const { count } = await supabase.from('leaderboard').select('id', { count: 'exact', head: true }).eq('deactivated', false)

  if (error) {
    throw createError(error)
  }

  const items = (data ?? []).map((entry) => {
    if (isValidLeaderboardId(params?.leaderboardId) && entry.id === params.leaderboardId) {
      return { ...entry, isPlayerEntry: true, id: undefined }
    }
    return { ...entry, id: undefined }
  })

  return {
    items,
    meta: {
      totalCount: count,
      from,
      to: from + perPage - 1,
    },
  }
}

export async function getLeaderboardPageById(id: string, perPage: number) {
  const supabase = useSupabaseServer()

  const { data, error } = await supabase.from('leaderboard_with_rank').select('position').eq('id', id).single().overrideTypes<LeaderboardListEntry>()

  if (error) {
    throw createError(error)
  }

  if (data) {
    return Math.floor((data.position - 1) / Number(perPage) + 1)
  }
}

export async function getLeaderboardRanking(score: number, averageAnswerTime: number, gameTime: number) {
  const supabase = useSupabaseServer()

  const { data, error } = await supabase.rpc('get_rank', {
    _score: score,
    _average_answer_time: averageAnswerTime,
    _game_time: gameTime,
  })

  if (error) {
    throw createError(error)
  }

  return data as number
}
