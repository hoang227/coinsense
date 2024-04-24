<template>
  <div class="grid grid-cols-6 gap-8">
    <div>
      <UButton label="Back" color="black" class="mb-4" icon="i-heroicons-arrow-left" @click="navigateTo('/mainpage')" />
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
</script>
