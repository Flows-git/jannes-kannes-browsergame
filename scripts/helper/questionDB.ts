import { useSupabase } from './supabase'

export async function useQuestionDB() {
  const supabase = await useSupabase()

  async function addQuestionToDB(q: QuestionDB) {
    const result = await supabase.from('questions').insert(q)
    if (result.error) {
      return false
    // console.error(result.error)
    }
    return true
  }

  async function addQuestionListToDB(questions: Array<QuestionDB>) {
    const skipped: Array<number> = []

    await Promise.all(questions.map(async (q) => {
      const success = await addQuestionToDB(q)
      if (!success) {
        skipped.push(q.id)
      }
    }))
    return skipped
  }

  return {
    addQuestionToDB,
    addQuestionListToDB,
  }
}
