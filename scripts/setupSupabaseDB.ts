import { useQuestionDB } from './helper/questionDB'
import { useSupabase } from './helper/supabase'
import { parseQuestionsCsvToJson } from './parseQuestionsCsvToJson'
import { parseTagsCsvToJson } from './parseTagsCsvToJson'

export async function setupSupabaseDB() {
  await setupQuestionsTable()
  await setupTagsTable()
}

async function setupQuestionsTable() {
  console.log('setupQuestionsTable...')
  const { addQuestionListToDB } = await useQuestionDB()

  const questions: QuestionDB[] = await parseQuestionsCsvToJson()
  const skipped = await addQuestionListToDB(questions)

  console.log(`${skipped.length}/${questions.length} questions skipped`)
  if (skipped.length > 0) {
    console.log(`skipped entries: ${skipped.sort((a, b) => a - b)}`)
  }
  console.log('setupQuestionsTable DONE')
}

async function setupTagsTable() {
  console.log('setupTagsTable...')
  const supabase = await useSupabase()

  const tags: GameTag[] = await parseTagsCsvToJson()
  const result = await supabase.from('tags').insert(
    tags.map(tag => ({
      name: tag.name,
      icon: tag.icon,
      reforgedIcon: tag.reforgedIcon,
    })),
  ).select()
  if (result.error) {
    throw new Error(`Error inserting tags - clear the tags table and try again.`)
  }
  const dbTags = result.data

  console.log(`Setup References for Tags...`)
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

  console.log('setupTagsTable DONE')
}

setupSupabaseDB()
