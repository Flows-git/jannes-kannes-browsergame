import { existsSync } from 'node:fs'
import { downloadUnzipAndDeleteFile } from './helper/download'

if (!existsSync('public/warcraft3_icons')) {
  downloadUnzipAndDeleteFile('https://wc3icons.coffbox.win/assets/warcraft3_icons.zip', 'warcraft3_icons.zip')
}
else {
  console.log(`Warcraft 3 Icons already downloaded and unzipped!`)
}
