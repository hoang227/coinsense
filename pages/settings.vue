<template>
  <div class="grid grid-cols-6 gap-8">
    <div>
      <UButton
        :ui="customButton"
        label="Back"
        color="emerald"
        class="mb-4"
        icon="i-heroicons-arrow-left"
        @click="navigateTo('/mainpage')"
      />
      <UVerticalNavigation :links="links" />
    </div>
    <div class="col-span-4">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
const links = [
  {
    label: 'Profile',
    to: '/settings/profile'
  },
  {
    label: 'Avatar',
    to: '/settings/avatar'
  },
  {
    label: 'Settings',
    to: '/settings/settings'
  }
]

const customButton = {
  color: {
    emerald: {
      solid:
        'ring-1 ring-inset ring-emerald-600 dark:ring-emerald-500 text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-white dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:disabled:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-500'
    },
    redwood: {
      solid:
        'ring-1 ring-inset ring-tagRedwood-light text-white bg-tagRedwood-light hover:bg-tagRedwood-dark disabled:bg-white dark:bg-tagRedwood-dark dark:hover:bg-tagRedwood-light dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-tagRedwood-dark dark:focus-visible:ring-tagRedwood-light'
    }
  }
}
</script>
