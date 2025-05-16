export default defineEventHandler(async (event) => {
  const { checkIfGameIsStarted, endGame } = await useGame(event)
  await checkIfGameIsStarted()
  endGame()
  return true
})
