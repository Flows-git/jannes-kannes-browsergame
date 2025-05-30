export default defineEventHandler(async (event) => {
  const { isGameRunning, answerCurrentQuestion } = await useGame(event)
  await isGameRunning()

  const body = await readBody<{ answer: string }>(event)
  return answerCurrentQuestion(body.answer)
})
