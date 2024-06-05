export default defineEventHandler(async (event) => {
  const session = await useGameSession(event)
  if (Object.keys(session.data).length === 0) {
    throw createError({ status: 416, message: 'No game started' })
  }

  let question: GameQuestionPlayer | undefined
  if (session.data.running) {
    const gameQuestion = session.data.questions?.[session.data.currentQuestion - 1]
    question = parseQuestion(gameQuestion)
  }

  return { question, meta: {
    running: session.data.running,
    currentQuestion: session.data.currentQuestion,
    totalQuestions: session.data.totalQuestions,
    correctAnswers: session.data.correctAnswers,
  } }
})
