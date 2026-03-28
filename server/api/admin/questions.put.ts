export default defineEventHandler(async (event) => {
  const body = await readBody<QuestionDB>(event)

  if (!body.id) {
    throw createError({ statusCode: 400, message: 'id is required' })
  }

  const supabase = useSupabaseServer()

  const { id, tags, ...updateData } = body

  const { data, error } = await supabase
    .from('questions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
    .overrideTypes<QuestionDB>()

  if (error)
    throw createError({ statusCode: 500, message: error.message })

  const { error: deleteError } = await supabase
    .from('question_tags')
    .delete()
    .eq('question_id', id)
  if (deleteError)
    throw createError({ statusCode: 500, message: deleteError.message })

  if (tags?.length) {
    const { error: tagsError } = await supabase
      .from('question_tags')
      .insert(tags.map(t => ({ question_id: id, tag_id: t.id })))
    if (tagsError)
      throw createError({ statusCode: 500, message: tagsError.message })
  }

  return { ...data, tags: tags ?? [] }
})
