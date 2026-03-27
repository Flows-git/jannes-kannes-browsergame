import { useQuestionDB } from './helper/questionDB'
import { useSupabase } from './helper/supabase'
import { parseQuestionsCsvToJson } from './parseQuestionsCsvToJson'
import { parseTagsCsvToJson } from './parseTagsCsvToJson'

export async function setupSupabaseDB() {
  await setupQuestionsTable()
  await setupTags()
}

async function setupQuestionsTable() {
  console.log('setup Questions table...')
  const { addQuestionListToDB } = await useQuestionDB()

  const questions: QuestionDB[] = await parseQuestionsCsvToJson()
  const skipped = await addQuestionListToDB(questions)

  console.log(`${skipped.length}/${questions.length} questions skipped`)
  if (skipped.length > 0) {
    console.log(`skipped entries: ${skipped.sort((a, b) => a - b)}`)
  }

  console.log('resetting questions sequence...')
  const supabase = useSupabase()
  const { error } = await supabase.rpc('reset_questions_sequence')
  if (error) throw error
  console.log('resetting questions sequence... DONE')

  console.log('setup Questions table... DONE')
}

async function setupTags() {
  const tags: GameTag[] = await parseTagsCsvToJson()
  setupTagsTable(tags)
  setupTagsReferencesTable(tags)
}

async function setupTagsTable(tags: GameTag[]) {
  console.log('setup Tags table...')
  const supabase = await useSupabase()

  const result = await supabase.from('tags').insert(
    tags.map(tag => ({
      name: tag.name,
      icon: tag.icon,
      reforgedIcon: tag.reforgedIcon,
    })),
  ).select()
  if (result.error) {
    throw result.error
  }
  console.log('setup Tags table... DONE')
}

async function setupTagsReferencesTable(tags: GameTag[]) {
  console.log(`Setup Tag References Table...`)
  const supabase = await useSupabase()
  const references: Array<{ child_id: string, parent_id: string }> = []

  for (const tag of tags) {
    if (tag.parents && tag.parents.length > 0) {
      // const parentIds = tag.parents.map(parentIndex => tags[parentIndex].id)
      references.push(...tag.parents.map(parentId => ({ child_id: tag.name, parent_id: parentId })))
    }
  }

  const result = await supabase.from('tags_reference').insert(references)
  if (result.error) {
    throw result.error
  }
  console.log(`Setup Tag References Table... DONE`)
}

setupSupabaseDB()
