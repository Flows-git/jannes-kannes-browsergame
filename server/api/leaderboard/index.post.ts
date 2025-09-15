export default defineEventHandler(async (event) => {
  const { submitGameResult } = await useGame(event)
  const { name } = await readBody<{ name: string }>(event)

  await submitGameResult(name)
  return true
})
