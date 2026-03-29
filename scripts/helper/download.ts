import { createWriteStream, existsSync, unlinkSync } from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream'

import { promisify } from 'node:util'

import decompress from 'decompress'

/**
 * For Zip Files!
 * Downloads a file, unzips the file and deletes the file at the end
 */
export async function downloadUnzipAndDeleteFile(url: string, filename: string, folder: string) {
  // Download downloaded file if it does not exist
  if (!existsSync(`${folder}/${filename}`)) {
    console.log(`Download ${filename}...`)
    await downloadFile(url, filename, folder)
    console.log(`${filename} downloaded!`)
  }

  try {
    // Unzip the downloaded file
    console.log(`Unzip ${filename}`)
    await decompress(`${folder}/${filename}`, folder)
    console.log(`${filename} unzipped`)
  }
  catch (error) {
    throw new Error(`Error while unzipping ${filename}`, { cause: error })
  }

  // Delete the downloaded file
  unlinkSync(`game/public/${filename}`)
  console.log(`${filename} deleted`)
}

/**
 * Downloads a file and saves it in the public folder
 */
export async function downloadFile(url: string, fileName: string, folder: string) {
  // Download the file from the passed url
  const response = await fetch(url)

  // Check if download was successfull
  if (!response.ok || !response.body)
    throw new Error(`unexpected response ${response.status} ${response.statusText}`)

  // Save the file in public folder
  const destination = path.resolve(folder, fileName)
  const streamPipeline = promisify(pipeline)
  await streamPipeline(response.body as any, createWriteStream(destination))
}
