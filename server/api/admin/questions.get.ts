export default defineEventHandler(async (event) => {
  const { search, sortBy, sortOrder } = getQuery<{
    search?: string
    sortBy?: keyof QuestionDB
    sortOrder?: 'asc' | 'desc'
  }>(event)

  const supabase = useSupabaseServer()

  let query = supabase.from('questions').select('*')

  if (search) {
    query = query.or(`question.ilike.%${search}%,correctAnswer.ilike.%${search}%,answers.cs.{"${search}"}`)
  }

    query = query.order(sortBy ?? 'id', { ascending: sortOrder !== 'desc' })

  const { data, error } = await query.overrideTypes<QuestionDB[]>()

  if (error)
    throw createError({ statusCode: 500, message: error.message })

  return data
})
