export const useRedirectIfAuthenticated = (url = '/mainpage') => {
  const user = useSupabaseUser()

  watch(
    user,
    user => {
      if (user) {
        if (user.user_metadata.set_up_complete) {
          setTimeout(() => {
            navigateTo(url)
          }, 1000)
        } else {
          return navigateTo('/setup')
        }
      }
    },
    { immediate: true }
  )

  return { user }
}
