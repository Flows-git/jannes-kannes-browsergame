import questionsJson from '@@/data/questions.json'
import { useQuestionDB } from './helper/questionDB'

console.log('setup supabase database...')
const { addQuestionListToDB, parseQuestionForDB } = await useQuestionDB()

const questions: GameQuestionServer[] = questionsJson
const dbQuestions = questions.map(q => parseQuestionForDB(q))
const skipped = await addQuestionListToDB(dbQuestions)

console.log(`${skipped.length}/${questions.length} questions skipped`)
console.log(`skipped entries: ${skipped.sort((a, b) => a - b)}`)
