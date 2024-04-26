export function useJsonToTags(json: string): Tag[] {
  const tags = ref<Tag[]>([])
  // Convert JSON object to tags array
  const convertToTags = () => {
    const tagsWithColor = JSON.parse(json)
    tags.value = tagsWithColor.map((tag: Tag) => {
      return {
        name: tag.name,
        color: tag.color
      }
    })
  }
  convertToTags()
  return tags.value
}
