export function useTagsToJson(tags: Tag[]): string {
  const json = ref('')

  // Convert tags array to JSON object
  const convertToJSON = () => {
    const tagsWithColor = tags.map(tag => {
      return {
        name: tag.name,
        color: tag.color
      }
    })
    json.value = JSON.stringify(tagsWithColor)
  }

  convertToJSON()

  return json.value
}
