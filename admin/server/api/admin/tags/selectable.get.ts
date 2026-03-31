export default defineEventHandler(async () => {
  const supabase = useSupabaseServer()

  const { data, error } = await supabase
    .from('tags')
    .select()
    .overrideTypes<GameTag[]>()

  if (error)
    throw createError({ statusCode: 500, message: error.message })

  return data
})
