export default defineEventHandler(async () => {
  const supabase = useSupabaseServer()

  const { data, error } = await supabase
    .from('questions')
    .select('creepjackEpisode, jkEpisode')
    .overrideTypes<Array<Pick<QuestionDB, 'creepjackEpisode' | 'jkEpisode'>>>()

  if (error)
    throw createError({ statusCode: 500, message: error.message })

  const maxCj = Math.max(0, ...data.map(q => q.creepjackEpisode))
  const maxJk = Math.max(0, ...data.map(q => Number(q.jkEpisode) || 0))

  return {
    creepjackEpisode: maxCj + 1,
    jkEpisode: String(maxJk + 1),
  }
})
