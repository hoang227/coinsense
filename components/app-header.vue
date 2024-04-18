<template>
  <header class="flex justify-between mt-10">
    <NuxtLink to="/" class="text-xl">
      coin.sense
    </NuxtLink>
    <div class="flex items-center justify-between space-x-2">
      <UButton class="" label="logout" color="white" variant="ghost" @click="handleLogout" />
      <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" />
    </div>
  </header>
</template>

<script setup lang="ts">

const supabase = useSupabaseClient()
const { toastSuccess, toastError } = useAppToast()

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()

    if (!error) {
      toastSuccess({
        title: 'successfully logged out'
      })
    } else {
      throw error
    }
  } catch (error) {
    toastError({
      title: 'failed to logged out'
    })
  }

  return navigateTo('/login')
}

</script>
