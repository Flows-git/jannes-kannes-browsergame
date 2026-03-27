export default defineEventHandler(async (event) => {
  const body = await readBody<Omit<QuestionDB, 'id'>>(event)

  const supabase = useSupabaseServer()

  const { data, error } = await supabase
    .from('questions')
    .insert(body)
    .select()
    .single()
    .overrideTypes<QuestionDB>()

  if (error)
    throw createError({ statusCode: 500, message: error.message })

  return data
})
