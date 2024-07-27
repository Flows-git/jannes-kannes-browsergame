import { existsSync } from 'node:fs'
import { downloadUnzipAndDeleteFile } from './helper/download'
import { parseQuestionsCsvToJson } from './parseQuestionsCsvToJson'
import { parseTagsCsvToJson } from './parseTagsCsvToJson'

if (!existsSync('public/warcraft3_icons')) {
  downloadUnzipAndDeleteFile('https://wc3icons.coffbox.win/assets/warcraft3_icons.zip', 'warcraft3_icons.zip')
}
else {
  console.log(`Warcraft 3 Icons already downloaded and unzipped!`)
}

await parseQuestionsCsvToJson()
console.log(`questions.csv is parsed to JSON`)

await parseTagsCsvToJson()
console.log(`tags.csv is parsed to JSON`)
