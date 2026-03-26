import { useSupabase } from './supabase'

export async function useTagsDB() {
  const supabase = await useSupabase()

  async function addTagToDB(q: GameTag) {
    const result = await supabase.from('tags').insert(q)
    if (result.error) {
      return false
    // console.error(result.error)
    }
    return true
  }

  async function addTagListToDB(tags: Array<GameTag>) {
    const skipped: Array<number> = []

    await Promise.all(tags.map(async (q) => {
      const success = await addTagToDB(q)
      if (!success) {
        skipped.push(q.id)
      }
    }))
    return skipped
  }

  return {
    addTagToDB,
    addTagListToDB,
  }
}
