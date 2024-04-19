<template>
  <div>
    <UVerticalNavigation :links="links" />
    <div>
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
