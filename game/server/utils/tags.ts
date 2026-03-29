import type { SupabaseClient } from '@supabase/supabase-js'

interface TagInput { id?: number, name: string, icon?: string, reforgedIcon?: string }

export async function resolveTagIds(supabase: SupabaseClient, tags: TagInput[]): Promise<number[]> {
  const existingIds = tags.filter(t => t.id).map(t => t.id!)
  const newTags = tags.filter(t => !t.id)

  if (!newTags.length)
    return existingIds

  const { data, error } = await supabase
    .from('tags')
    .insert(newTags.map(t => ({ name: t.name, icon: t.icon ?? null, reforgedIcon: t.reforgedIcon ?? null })))
    .select('id')

  if (error)
    throw createError({ statusCode: 500, message: error.message })

  return [...existingIds, ...data.map((t: { id: number }) => t.id)]
}
