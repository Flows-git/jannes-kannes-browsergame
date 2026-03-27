export default defineEventHandler(async () => {
  const supabase = useSupabaseServer()

  const { data, error } = await supabase
    .from('tags_with_relations')
    .select()
    // .neq('parents', '{}')
    .overrideTypes<GameTag[]>()

  if (error)
    throw createError({ statusCode: 500, message: error.message })

  return data
})
