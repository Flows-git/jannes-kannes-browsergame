export default defineEventHandler(async (event) => {
  const { getQuestionForPlayer, getGameMeta, isGameRunning } = await useGame(event)
  await isGameRunning()
  return {
    question: getQuestionForPlayer(),
    meta: getGameMeta(),
  }
})
