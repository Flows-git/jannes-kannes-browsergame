import { existsSync } from 'node:fs'
import { downloadUnzipAndDeleteFile } from './helper/download'
import { upsertJsonFile } from './helper/upsertJsonFile'
// import { parseQuestionsCsvToJson } from './parseQuestionsCsvToJson'
import { parseTagsCsvToJson } from './parseTagsCsvToJson'
import { setupSupabaseDB } from './setupSupabaseDB'

if (!existsSync('public/warcraft3_icons')) {
  downloadUnzipAndDeleteFile('https://wc3icons.coffbox.win/assets/warcraft3_icons.zip', 'warcraft3_icons.zip')
}
else {
  console.log(`Warcraft 3 Icons already downloaded and unzipped!`)
}

// const questions = await parseQuestionsCsvToJson()
// await upsertJsonFile('questions', questions)
// console.log(`questions.csv is parsed to JSON`)

const tags = await parseTagsCsvToJson()
await upsertJsonFile('tags', tags)
console.log(`tags.csv is parsed to JSON`)

await setupSupabaseDB()
