<template>
  <div>
    <div class="mb-10 mt-48 w-3/4 text-8xl leading-[1.2] tracking-tighter">
      Simple Personal Finance Manager
    </div>
    <div class="ml-2 text-2xl">
      "literally the best finance manager in the world" - hoang
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'welcome'
})
useHead({
  title: 'Coinsense',
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }
  ]
})
</script>
