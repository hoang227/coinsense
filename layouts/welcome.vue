<template>
  <div>
    <AppHeader />
    <main class="mx-10 my-10">
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

const color = useColorMode()

color.preference = 'light'
</script>
