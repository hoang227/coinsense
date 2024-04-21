<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
  </div>
</template>

<style>

body {
  @apply font-inter dark:bg-gray-900 bg-white text-neutral-900 dark:text-white
}

h1 {
  @apply text-4xl tracking-tighter font-bold
}

h2 {
  @apply text-3xl tracking-tighter font-semibold
}

h3 {
  @apply text-2xl tracking-tight font-semibold
}

p {
  @apply text-sm
}

::-webkit-scrollbar {
  display: none;
}
</style>
