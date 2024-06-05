export default defineEventHandler(async (event) => {
  const gameSession: GameSession = {
    running: true,
    questions: await getRandomQuestions(3),
    currentQuestion: 1,
    totalQuestions: 3,
    correctAnswers: 0,
  }

  const session = await useGameSession(event)
  await session.update(gameSession)

  return true
})
