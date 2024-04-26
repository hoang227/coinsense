<template>
  <button class="text-xl" @click="toggleMode">{{ nextIcon }}</button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const modes = ['light', 'dark']

const nextModeIcons = {
  light: '🌕',
  dark: '🌑'
}

const nextMode = computed(() => {
  const currMode = modes.indexOf(colorMode.preference)
  return modes[(currMode + 1) % 2]
})

const nextIcon = computed(
  () => nextModeIcons[nextMode.value as keyof typeof nextModeIcons]
)

const toggleMode = () => (colorMode.preference = nextMode.value)
</script>
