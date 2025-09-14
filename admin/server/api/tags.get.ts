import tagLibrary from '@@/data/tags.json'

export default defineEventHandler(async (event) => {
  const parentTag = getQuery(event)?.tag

  let tags: Array<GameTag> = []
  if (parentTag) {
    tags = tagLibrary.filter(t => t.mainAttributes?.find(mainTag => mainTag === parentTag))
  }
  else {
    tags = tagLibrary.filter(t => !t.mainAttributes.length)
  }

  tags.forEach((tag) => {
    const hasChildren = !!tagLibrary.find(t => t.mainAttributes?.find(mainTag => mainTag === tag.name))
    // const children = !!tagLibrary.filter(t => t.mainAttributes?.find(mainTag => mainTag === tag.name))
    if (hasChildren) {
      tag.children = []
    }
  })

  return tags
})
