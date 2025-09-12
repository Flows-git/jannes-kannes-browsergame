export default defineEventHandler(async (event) => {
  const { isGameRunning, answerCurrentQuestion, getGameMeta } = await useGame(event)
  await isGameRunning()

  const body = await readBody<{ answer: string }>(event)
  const result = await answerCurrentQuestion(body.answer)
  return {
    result,
    meta: await getGameMeta(),
  }
})
