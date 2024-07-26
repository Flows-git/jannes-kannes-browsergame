import { createWriteStream, existsSync, unlinkSync } from 'node:fs'
import { pipeline } from 'node:stream'
import path from 'node:path'

import { promisify } from 'node:util'

import decompress from 'decompress'

/**
 * For Zip Files!
 * Downloads a file, unzips the file and deletes the file at the end
 */
export async function downloadUnzipAndDeleteFile(url: string, filename: string) {
  // Download downloaded file if it does not exist
  if (!existsSync(`public/${filename}`)) {
    console.log(`Download ${filename}...`)
    await downloadFile(url, filename)
    console.log(`${filename} downloaded!`)
  }

  try {
    // Unzip the downloaded file
    console.log(`Unzip ${filename}`)
    await decompress(`public/${filename}`, 'public')
    console.log(`${filename} unzipped`)
  }
  catch (error) {
    throw new Error(`Error while unzipping ${filename} - ${error}`)
  }

  // Delete the downloaded file
  unlinkSync(`public/${filename}`)
  console.log(`${filename} deleted`)
}

/**
 * Downloads a file and saves it in the public folder
 */
export async function downloadFile(url: string, fileName: string) {
  // Download the file from the passed url
  const response = await fetch(url)

  // Check if download was successfull
  if (!response.ok || !response.body)
    throw new Error(`unexpected response ${response.status} ${response.statusText}`)

  // Save the file in public folder
  const destination = path.resolve('public', fileName)
  const streamPipeline = promisify(pipeline)
  await streamPipeline(response.body, createWriteStream(destination))
}
