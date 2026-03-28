export default defineEventHandler(async (event) => {
  const { tags, ...body } = await readBody<Omit<QuestionDB, 'id'>>(event)

  const supabase = useSupabaseServer()

  const { data, error } = await supabase
    .from('questions')
    .insert(body)
    .select('id')
    .single()

  if (error)
    throw createError({ statusCode: 500, message: error.message })

  if (tags?.length) {
    const { error: tagsError } = await supabase
      .from('question_tags')
      .insert(tags.map(t => ({ question_id: data.id, tag_id: t.id })))
    if (tagsError)
      throw createError({ statusCode: 500, message: tagsError.message })
  }

  return { ...body, id: data.id, tags: tags ?? [] }
})
