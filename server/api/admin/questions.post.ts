import { resolveTagIds } from '~~/server/utils/tags'

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
    const allTagIds = await resolveTagIds(supabase, tags)
    const { error: tagsError } = await supabase
      .from('question_tags')
      .insert(allTagIds.map((tag_id: number) => ({ question_id: data.id, tag_id })))
    if (tagsError)
      throw createError({ statusCode: 500, message: tagsError.message })
  }

  return { ...body, id: data.id, tags: tags ?? [] }
})
