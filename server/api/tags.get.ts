import type { Tag } from '~/public/tags'
import tagLibrary from '~/public/tags.json'

export default defineEventHandler(async (event) => {
  const parentTag = getQuery(event)?.tag

  let tags: Array<Tag> = []
  if (parentTag) {
    tags = tagLibrary.filter(t => t.mainAttributes?.find(mainTag => mainTag === parentTag))
  }
  else {
    tags = tagLibrary.filter(t => !t.mainAttributes.length)
  }

  tags.forEach((tag) => {
    const hasChildren = !!tagLibrary.find(t => t.mainAttributes?.find(mainTag => mainTag === tag.name))
    if (hasChildren) {
      tag.children = []
    }
  })

  return tags
})
