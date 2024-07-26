import { parseCsvToJson } from './helper/parseCsvToJson'

parseCsvToJson<TagCsv, GameTag>('tags', (tag) => {
  const icon = tag.icon?.replace('.png', '')

  return {
    name: tag.name,
    icon: icon ? `${icon}.png` : undefined,
    reforgedIcon: icon ? `${icon}-Reforged.png` : undefined,
    mainAttributes: tag.main_attributes?.split(',').filter(t => t),
  }
})
