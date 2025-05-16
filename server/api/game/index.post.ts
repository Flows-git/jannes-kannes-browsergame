export default defineEventHandler(async (event) => {
  const { checkIfGameIsStarted, answerCurrentQuestion } = await useGame(event)
  await checkIfGameIsStarted()

  const body = await readBody<{ answer: string }>(event)
  return answerCurrentQuestion(body.answer)
})
