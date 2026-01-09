export default defineEventHandler(async (event) => {
  const { getQuestionForPlayer, getGameMeta, isGameStarted } = await useGame(event)
  isGameStarted()
  return {
    question: getQuestionForPlayer(),
    meta: await getGameMeta(),
  }
})
