<template>
  <div class="grid grid-cols-6 gap-8">
    <UVerticalNavigation :links="links" />
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
    label: 'settings',
    to: '/settings/settings'
  }
]
</script>
