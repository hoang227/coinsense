<template>
  <div class="mx-40">
    <AppHeader />
    <main class="my-10">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Link to Google Fonts
useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
      crossorigin: ''
    }
  ]
})

const color = useColorMode()

color.preference = 'dark'
</script>

<style>
body {
  @apply font-clean
}

body {
  @apply dark:bg-gray-900 bg-stone-200
}
</style>
