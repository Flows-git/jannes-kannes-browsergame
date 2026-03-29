import { parseCsvToJson } from './helper/parseCsvToJson'

// filename ends with png or svg
const PNG_REGEX = /\.png$/
const SVG_REGEX = /\.svg$/

export async function parseTagsCsvToJson() {
  return parseCsvToJson<TagCsv, Omit<GameTag, 'id'>>('tags', (tag) => {
    const icon = tag.icon?.trim() || undefined

    return {
      name: tag.name,
      icon: icon || undefined,
      reforgedIcon: icon ? `${icon.replace(PNG_REGEX, '').replace(SVG_REGEX, '')}-Reforged.png` : undefined,
      parents: tag.main_attributes?.split(',').filter(t => t),
    }
  })
}
