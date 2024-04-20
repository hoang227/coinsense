<template>
  <header class="flex items-center justify-between mt-10">
    <NuxtLink to="/" class="text-4xl">
      coin.sense
    </NuxtLink>
    <div class="flex items-center justify-between space-x-2">
      <UDropdown v-if="user" :items="items" :ui="{ item: { disabled: 'cursor-text select-text' }, width: 'w-64' }">
        <img :src="url" class="shadow-lg size-20 object-cover rounded-full mt-6"></img>

        <template #account>
          <div class="text-left">
            <p>
              signed in as
            </p>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ user?.user_metadata.username ?? user?.email }}
            </p>
          </div>
        </template>

        <template #item="{ item }">
          <span class="truncate">{{ item.label }}</span>
          <UIcon :name="item.icon" class="flex-shrink-0 size-4 text-gray-400 dark:text-gray-500 ms-auto" />
        </template>
      </UDropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { DropdownItem } from '#ui/types'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { toastSuccess, toastError } = useAppToast()
const { url } = useAvatarUrl()

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

const items = [
  [{
    slot: 'account',
    disabled: true
  }],
  [{
    label: 'settings',
    icon: 'i-heroicons-cog-8-tooth',
    click: () => navigateTo('/settings/profile')
  },
  {
    label: 'logout',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: () => handleLogout()
  }]
] as DropdownItem[][]

</script>
