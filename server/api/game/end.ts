export default defineEventHandler(async (event) => {
  const session = await useGameSession(event)
  session.clear()
  return true
})
