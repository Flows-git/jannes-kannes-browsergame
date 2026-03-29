export default defineEventHandler(async (event) => {
  const request = await readBody<GameStartParams>(event)
  const gameSettings: GameSettings = { mode: request.mode }
  if (request.mode === 'classic') {
    gameSettings.questionCount = request.settings?.questionCount ?? 3
    gameSettings.liveCount = request.settings?.questionCount ?? 3
  }
  else if (request.mode === 'ranked') {
    gameSettings.questionCount = await getAllQuestionsCount()
    gameSettings.liveCount = 3
  }
  else if (request.mode === 'endless') {
    const questionCount = await getAllQuestionsCount()
    gameSettings.questionCount = questionCount
    gameSettings.liveCount = questionCount
  }
  await (await useGame(event)).startGame(gameSettings)
  return true
})
