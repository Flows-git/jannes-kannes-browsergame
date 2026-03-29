export default defineEventHandler(async (event) => {
  const { search, sortBy, sortOrder } = getQuery<{
    search?: string
    sortBy?: keyof QuestionDB
    sortOrder?: 'asc' | 'desc'
  }>(event)

  const supabase = useSupabaseServer()

  let query = supabase.from('questions').select('*, question_tags(tags(id, name, icon, reforgedIcon))')

  if (search) {
    query = query.or(`question.ilike.%${search}%,correctAnswer.ilike.%${search}%,answers.cs.{"${search}"}`)
  }

  query = query.order(sortBy ?? 'id', { ascending: sortOrder !== 'desc' })

  const { data, error } = await query.overrideTypes<Array<QuestionDB & { question_tags: Array<{ tags: GameTag }> }>>()

  if (error)
    throw createError({ statusCode: 500, message: error.message })

  return data.map(({ question_tags, ...q }) => ({
    ...q,
    tags: question_tags?.map(t => t.tags) ?? [],
  }))
})
