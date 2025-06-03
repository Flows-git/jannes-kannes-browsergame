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
      questionCount: getAllQuestionsCount(),
      liveCount: request.settings?.liveCount ?? 3,
    }
  }
  else if (request.mode === 'endless') {
    gameSettings = {
      questionCount: getAllQuestionsCount(),
      liveCount: getAllQuestionsCount(),
    }
  }
  await (await useGame(event)).startGame(gameSettings)
  return true
})
