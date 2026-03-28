import { useQuestionDB } from './helper/questionDB'
import { useSupabase } from './helper/supabase'
import { parseQuestionsCsvToJson } from './parseQuestionsCsvToJson'
import { parseTagsCsvToJson } from './parseTagsCsvToJson'

export async function setupSupabaseDB() {
  await setupQuestionsTable()
  await setupTagsTable()
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
  if (error)
    throw error
  console.log('resetting questions sequence... DONE')

  console.log('setup Questions table... DONE')
}

async function setupTagsTable() {
  const tags: Omit<GameTag, 'id'>[] = await parseTagsCsvToJson()
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

  console.log(`Setup Tag References Table...`)
  const dbTags = result.data
  const references: Array<{ child_id: number, parent_id: number }> = []
  for (const tag of tags) {
    if (tag.parents && tag.parents.length > 0) {
      // const parentIds = tag.parents.map(parentIndex => tags[parentIndex].id)
      const tagId = dbTags.find(t => t.name === tag.name)?.id
      if (!tagId) {
        console.warn('Could not find tag in DB for name:', tag.name)
        continue
      }
      const parentIds = dbTags.filter(t => tag.parents?.includes(t.name)).map(t => t.id)
      references.push(...parentIds.map(parentId => ({ child_id: tagId, parent_id: parentId })))
    }
  }

  const result2 = await supabase.from('tags_reference').insert(references)
  if (result2.error) {
    throw new Error(`Error inserting tag references - clear the tags table and try again.`)
  }
  console.log(`Setup Tag References Table... DONE`)

  return result.data
}

setupSupabaseDB()
