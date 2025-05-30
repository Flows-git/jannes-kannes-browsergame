export default defineEventHandler(async (event) => {
  const { getQuestionForPlayer, getGameMeta, isGameStarted } = await useGame(event)
  await isGameStarted()
  return {
    question: getQuestionForPlayer(),
    meta: getGameMeta(),
  }
})
