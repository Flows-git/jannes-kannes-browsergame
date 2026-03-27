export default defineEventHandler(async (event) => {
  const body = await readBody<QuestionDB>(event)

  if (!body.id) {
    throw createError({ statusCode: 400, message: 'id is required' })
  }

  const supabase = useSupabaseServer()

  const { id, ...updateData } = body

  const { data, error } = await supabase
    .from('questions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
    .overrideTypes<QuestionDB>()

  if (error)
    throw createError({ statusCode: 500, message: error.message })

  return data
})
