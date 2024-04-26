<template>
  <header class="mx-10 mt-4 flex items-center justify-between">
    <div class="flex items-center justify-between space-x-8">
      <NuxtLink to="/">
        <h1>Coinsense</h1>
      </NuxtLink>
      <UButton
        v-if="user && isWelcomePage"
        class="text-xl font-light"
        color="gray"
        label="Get Started"
        variant="ghost"
        @click="navigateTo('/mainpage')"
      />
    </div>
    <div class="flex items-center justify-between space-x-2">
      <UDropdown
        v-if="user"
        :items="items"
        :ui="{ item: { disabled: 'cursor-text select-text' }, width: 'w-64' }"
      >
        <div class="flex items-center justify-between space-x-4">
          <p class="text-stone-700">
            {{ user?.user_metadata.username ?? user?.email }}
          </p>
          <img
            v-if="url"
            :src="url"
            class="size-14 rounded-full object-cover shadow-md"
          />
          <img
            v-else
            src="/public/img/blank_profile.png"
            class="size-14 rounded-full object-cover shadow-md"
          />
        </div>

        <template #account>
          <div class="text-left">
            <p>Signed in as</p>
            <p class="text-gray-900 dark:text-white">
              {{ user?.user_metadata.username ?? user?.email }}
            </p>
          </div>
        </template>

        <template #item="{ item }">
          <p class="truncate">
            {{ item.label }}
          </p>
          <UIcon
            :name="item.icon"
            class="ms-auto size-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
          />
        </template>
      </UDropdown>
      <UButton
        v-else
        class="text-xl font-light"
        color="white"
        label="Log In"
        variant="ghost"
        @click="navigateTo('/login')"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import type { DropdownItem } from '#ui/types'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()
const { toastSuccess, toastError } = useAppToast()
const { url } = useAvatarUrl()

const isWelcomePage = computed(() => route.path === '/')

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

  return navigateTo('/')
}

const items = [
  [
    {
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: 'settings',
      icon: 'i-heroicons-cog-8-tooth',
      click: () => navigateTo('/settings/profile')
    },
    {
      label: 'logout',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: () => handleLogout()
    }
  ]
] as DropdownItem[][]
</script>
