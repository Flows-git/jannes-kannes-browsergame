import { useQuestionDB } from './helper/questionDB'
import { parseQuestionsCsvToJson } from './parseQuestionsCsvToJson'

export async function setupSupabaseDB() {
  console.log('setup supabase database...')
  const { addQuestionListToDB } = await useQuestionDB()

  const questions: QuestionDB[] = await parseQuestionsCsvToJson()
  const skipped = await addQuestionListToDB(questions)

  console.log(`${skipped.length}/${questions.length} questions skipped`)
  if (skipped.length > 0) {
    console.log(`skipped entries: ${skipped.sort((a, b) => a - b)}`)
  }
  console.log('setup supabase database DONE')
}
