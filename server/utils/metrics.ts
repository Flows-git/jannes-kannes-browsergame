export async function addAnswerMetrics(sessionId: string, questionId: number, answer: string, answerCorrect: boolean, gameMode: GameMode): Promise<void> {
  const supabase = useSupabaseServer()
  const { error } = await supabase
    .from('answerMetrics')
    .insert({
      sessionId,
      question: questionId,
      answer,
      answerCorrect,
      gameMode,
    })

  if (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }
}

export async function addResultMetrics(session: GameSession): Promise<void> {
  const supabase = useSupabaseServer()
  const { error } = await supabase
    .from('resultMetrics')
    .insert({
      gameMode: session.gameMode,
      answeredQuestions: session.answeredQuestions,
      correctAnswers: session.correctAnswers,
      startTime: new Date(session.startTime).toISOString(),
      endTime: new Date(session.endTime!).toISOString(),
      gameTimeInSeconds: getTimeDurationInSeconds(session.startTime, session.endTime as number),
      averageAnswerTimeInSeconds: getAverageAnswerTimeInSeconds(session.startTime, session.endTime as number, session.answeredQuestions).toFixed(1),
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
