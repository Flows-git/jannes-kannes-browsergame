export async function addAnswerMetrics(questionId: number, answer: string, answerCorrect: boolean, gameMode: GameMode): Promise<void> {
  const supabase = useSupabaseServer()
  const { error } = await supabase
    .from('answerMetrics')
    .insert({
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
