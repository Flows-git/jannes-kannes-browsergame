export default defineEventHandler(async (event) => {
  const { id } = getQuery<{ id?: string }>(event)

  if (!id) {
    throw createError({ statusCode: 400, message: 'id is required' })
  }

  const supabase = useSupabaseServer()

  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', Number(id))

  if (error)
    throw createError({ statusCode: 500, message: error.message })
})
