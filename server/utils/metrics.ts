function metricsActivated() {
  const config = useRuntimeConfig()
  return config.metrics
}

export async function addAnswerMetrics(sessionId: string, questionId: number, answer: string, answerCorrect: boolean, gameMode: GameMode, answerTime: number): Promise<void> {
  if (metricsActivated()) {
    const supabase = useSupabaseServer()
    const { error } = await supabase
      .from('answerMetrics')
      .insert({
        sessionId,
        question: questionId,
        answer,
        answerCorrect,
        gameMode,
        answerTime,
      })

    if (error) {
      console.error(error)
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      })
    }
  }
}

export async function addResultMetrics(session: GameSession): Promise<void> {
  if (metricsActivated()) {
    const supabase = useSupabaseServer()
    const { error } = await supabase
      .from('resultMetrics')
      .insert({
        gameMode: session.gameMode,
        answeredQuestions: session.answeredQuestions,
        correctAnswers: session.correctAnswers,
        startTime: new Date(session.startTime).toISOString(),
        endTime: new Date(session.endTime!).toISOString(),
        gameTime: session.gameTime,
        averageAnswerTime: getAverageAnswerTime(session),
        sessionId: session.sessionId,
      })

    if (error) {
      console.error(error)
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      })
    }
  }
}
