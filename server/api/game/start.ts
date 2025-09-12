export default defineEventHandler(async (event) => {
  const request = await readBody<GameStartParams>(event)
  let gameSettings: GameSettings = {}
  if (request.mode === 'classic') {
    gameSettings = {
      questionCount: request.settings?.questionCount ?? 3,
      liveCount: request.settings?.questionCount ?? 3,
    }
  }
  else if (request.mode === 'ranked') {
    gameSettings = {
      questionCount: await getAllQuestionsCount(),
      liveCount: 3,
    }
  }
  else if (request.mode === 'endless') {
    const questionCount = await getAllQuestionsCount()
    gameSettings = {
      questionCount,
      liveCount: questionCount,
    }
  }
  await (await useGame(event)).startGame(gameSettings)
  return true
})
