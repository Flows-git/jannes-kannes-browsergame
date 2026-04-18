export default defineEventHandler(async (event) => {
  const { getQuestionForPlayer, getGameMeta, isGameStarted } = await useGame(event)
  isGameStarted()
  return {
    question: await getQuestionForPlayer(),
    meta: await getGameMeta(),
  }
})
