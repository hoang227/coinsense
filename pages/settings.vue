<template>
  <div class="grid grid-cols-6 gap-8">
    <div>
      <UButton label="back" class="mb-4" icon="i-heroicons-arrow-left" @click="navigateTo('/mainpage')" />
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
    label: 'profile',
    to: '/settings/profile'
  },
  {
    label: 'avatar',
    to: '/settings/avatar'
  },
  {
    label: 'settings',
    to: '/settings/settings'
  }
]
</script>
