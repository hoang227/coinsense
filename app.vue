<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: ''
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'
    }
  ]
})
</script>

<style>
body {
  @apply bg-white font-inter text-neutral-900 dark:bg-gray-900 dark:text-white;
}

h1 {
  @apply text-4xl font-bold tracking-tighter;
}

h2 {
  @apply text-3xl font-semibold tracking-tighter;
}

h3 {
  @apply text-2xl font-semibold tracking-tight;
}

p {
  @apply text-sm;
}

::-webkit-scrollbar {
  display: none;
}
</style>
