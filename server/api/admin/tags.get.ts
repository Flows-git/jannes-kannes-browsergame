export default defineEventHandler(async (event) => {
  const { tag: parentTagName } = getQuery<{ tag?: string }>(event)
  const supabase = useSupabaseServer()

  const query = supabase.from('tags_with_relations').select()

  if (parentTagName) {
    query.contains('parents', [parentTagName])
  }
  else {
    query.eq('parents', '{}')
  }

  const { data, error } = await query.overrideTypes<GameTag[]>()

  if (error) throw createError({ statusCode: 500, message: error.message })
  return data.map(d => ({ ...d, children: d.children?.length ? [] : undefined})) ?? []
})
