export default defineEventHandler(async (event) => {
  const settings = await readBody<GameSettings>(event)
  await (await useGame(event)).startGame(settings)
  return true
})
