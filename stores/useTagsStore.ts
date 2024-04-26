const supabase = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const { toastSuccess, toastError } = useAppToast()

export const useTagsStore = defineStore({
  id: 'tags',
  state: () => ({
    tags: user.value?.user_metadata.tags
  }),
  getters: {
    getTags: state => state.tags,
    getCount: state => state.tags.length
  },
  actions: {
    async addTag(tag: { name: string; color: string }) {
      loading.value = true
      try {
        const newTags: Tag[] = user.value?.user_metadata.tags

        if (
          newTags.some(
            currTag => currTag.name === tag.name || currTag.color === tag.color
          )
        ) {
          throw new Error('Tag already exists.')
        }

        newTags.push(tag)

        const { error } = await supabase.auth.updateUser({
          data: {
            tags: newTags
          }
        })

        if (error) {
          throw error
        }

        this.tags = user.value?.user_metadata.tags

        navigateTo('/settings/settings')

        toastSuccess({
          title: 'Tag added'
        })
      } catch (error) {
        toastError({
          title: 'Error adding tag',
          description: (error as Error).message
        })
      } finally {
        loading.value = false
      }

      return loading
    },
    async removeTag(tag: string) {
      loading.value = true
      try {
        const newTags: Tag[] = user.value?.user_metadata.tags.filter(
          (item: Tag) => {
            return item.name !== tag
          }
        )
        const { error } = await supabase.auth.updateUser({
          data: {
            tags: newTags
          }
        })

        if (error) {
          throw error
        }

        this.tags = user.value?.user_metadata.tags

        navigateTo('/settings/settings')

        toastSuccess({
          title: 'Tag removed'
        })
      } catch (error) {
        toastError({
          title: 'Error removing tag',
          description: (error as Error).message
        })
      } finally {
        loading.value = false
      }

      return loading
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTagsStore, import.meta.hot))
}
