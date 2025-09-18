export default defineEventHandler(async (event) => {
  const { submitGameResult } = await useGame(event)
  const { name } = await readBody<{ name: string }>(event)

  return await submitGameResult(name)
})
