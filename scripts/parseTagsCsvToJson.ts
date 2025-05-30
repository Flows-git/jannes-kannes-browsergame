import { parseCsvToJson } from './helper/parseCsvToJson'

export async function parseTagsCsvToJson() {
  parseCsvToJson<TagCsv, GameTag>('tags', (tag) => {
    const icon = tag.icon

    return {
      name: tag.name,
      icon: icon || undefined,
      reforgedIcon: icon ? `${icon}-Reforged.png` : undefined,
      mainAttributes: tag.main_attributes?.split(',').filter(t => t),
    }
  })
}
