import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

export async function upsertJsonFile(filename: string, data: Record<string, any>) {
  fs.writeFile(path.join(process.cwd(), 'data', `${filename}.json`), JSON.stringify(data), (err) => {
    if (err) {
      console.error(err)
    }
    else {
      // file written successfully
    }
  })
}
