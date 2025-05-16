export default defineEventHandler(async (event) => {
  const { getQuestionForPlayer, getGameMeta, checkIfGameIsStarted } = await useGame(event)
  await checkIfGameIsStarted()

  return {
    question: getQuestionForPlayer(),
    meta: getGameMeta(),
  }
})
