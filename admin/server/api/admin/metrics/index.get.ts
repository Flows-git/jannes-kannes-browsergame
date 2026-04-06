interface AnswerMetrics {
  total: number
  correct: number
  false: number
}

interface QuestionMetrics {
  totalQuestions: number // count of questions table
  answeredQuestions: number // questions with min 1 answer
  answers: AnswerMetrics // answer metrics over all game modes
  answersPerMode: { // answer metrics per game mode
    ranked: AnswerMetrics
    classic: AnswerMetrics
    endless: AnswerMetrics
  }
  totalResults: number
  resultsPerGameMode: {
    ranked: number
    classic: number
    endless: number
  }
  averageAnswerTime: number
  averageGameTime: number
}

function buildAnswerMetrics(rows: Array<{ answerCorrect: boolean }>): AnswerMetrics {
  const total = rows.length
  const correct = rows.filter(r => r.answerCorrect).length
  return { total, correct, false: total - correct }
}

export default defineEventHandler(async (): Promise<QuestionMetrics> => {
  const supabase = useSupabaseServer()

  const [questionsResult, answersResult, resultsResult] = await Promise.all([
    supabase.from('questions').select('id', { count: 'exact', head: true }),
    supabase.from('answerMetrics').select('question, answerCorrect, gameMode'),
    supabase.from('resultMetrics').select('gameMode, averageAnswerTimeInSeconds, gameTimeInSeconds'),
  ])

  if (questionsResult.error)
    throw createError({ statusCode: 500, message: questionsResult.error.message })
  if (answersResult.error)
    throw createError({ statusCode: 500, message: answersResult.error.message })
  if (resultsResult.error)
    throw createError({ statusCode: 500, message: resultsResult.error.message })

  const answers = answersResult.data as Array<{ question: number, answerCorrect: boolean, gameMode: string }>
  const results = resultsResult.data as Array<{ gameMode: string, averageAnswerTimeInSeconds: number, gameTimeInSeconds: number }>
  const uniqueQuestions = new Set(answers.map(a => a.question))

  const avgAnswerTime = results.length > 0
    ? results.reduce((sum, r) => sum + r.averageAnswerTimeInSeconds, 0) / results.length
    : 0
  const avgGameTime = results.length > 0
    ? results.reduce((sum, r) => sum + r.gameTimeInSeconds, 0) / results.length
    : 0

  return {
    totalQuestions: questionsResult.count ?? 0,
    answeredQuestions: uniqueQuestions.size,
    answers: buildAnswerMetrics(answers),
    answersPerMode: {
      ranked: buildAnswerMetrics(answers.filter(a => a.gameMode === 'ranked')),
      classic: buildAnswerMetrics(answers.filter(a => a.gameMode === 'classic')),
      endless: buildAnswerMetrics(answers.filter(a => a.gameMode === 'endless')),
    },
    totalResults: results.length,
    resultsPerGameMode: {
      ranked: results.filter(r => r.gameMode === 'ranked').length,
      classic: results.filter(r => r.gameMode === 'classic').length,
      endless: results.filter(r => r.gameMode === 'endless').length,
    },
    averageAnswerTime: Math.round(avgAnswerTime * 10) / 10,
    averageGameTime: Math.round(avgGameTime * 10) / 10,
  }
})
