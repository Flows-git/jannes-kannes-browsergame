export default defineEventHandler(async (event) => {
  const answer = await readBody(event)

  const session = await useGameSession(event)
  const question = session.data.questions[session.data.currentQuestion - 1]

  // check if answer was correct
  const answerCorrect = answer.answer === question.correctAnswer

  await session.update({
    currentQuestion: session.data.currentQuestion + 1,
    correctAnswers: answerCorrect ? session.data.correctAnswers + 1 : session.data.correctAnswers,
  })

  // ends the game after the last question was answered
  if (session.data.currentQuestion > session.data.totalQuestions) {
    await session.update({
      running: false,
      currentQuestion: undefined,
    })
  }

  // returns if given answer was correct and the correct answer
  return {
    correct: answerCorrect,
    corretAnswer: question.correctAnswer,
  }
})
