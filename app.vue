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
  @apply font-inter dark:bg-gray-900 bg-stone-200
}

h1 {
  @apply text-4xl tracking-tighter font-bold
}

p {
  @apply text-sm
}

::-webkit-scrollbar {
  display: none;
}
</style>
