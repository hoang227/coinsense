<template>
  <div class="grid grid-cols-2 py-4 border-b border-stone-100 dark:border-gray-700 text-gray-500 dark:text-gray-400">
    <div class="flex items-center justify-between">
      {{ date }}
    </div>
    <div class="flex items-center justify-end mr-10" :class="color">
      {{ currency }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  date: {
    type: String,
    required: true
  },
  transactions: {
    type: Array as () => Transaction[],
    required: true
  }
})

const sum = computed(() => {
  let sum = 0
  for (const transaction of props.transactions) {
    if (transaction.type === 'income') {
      sum += transaction.amount ?? 0
    } else {
      sum -= transaction.amount ?? 0
    }
  }
  return sum
})

const color = computed(() => sum.value >= 0 ? 'green' : 'red')

const { currency } = useCurrency(sum)
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400
}

.red {
  @apply text-red-600 dark:text-red-400
}
</style>
