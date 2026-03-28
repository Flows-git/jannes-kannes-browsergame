import { parseCsvToJson } from './helper/parseCsvToJson'

export async function parseTagsCsvToJson() {
  return parseCsvToJson<TagCsv, Omit<GameTag, 'id'>>('tags', (tag) => {
    const icon = tag.icon?.trim() || undefined

    return {
      name: tag.name,
      icon: icon || undefined,
      reforgedIcon: icon ? `${icon.replace(/\.png$/, '').replace(/\.svg$/, '')}-Reforged.png` : undefined,
      parents: tag.main_attributes?.split(',').filter(t => t),
    }
  })
}
