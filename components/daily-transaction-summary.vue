<template>
  <div
    class="grid grid-cols-2 border-b border-gray-300 py-4 text-gray-500 dark:border-gray-700 dark:text-gray-400"
  >
    <div class="flex items-center justify-between">
      {{ formattedDate }}
    </div>
    <div class="mr-10 flex items-center justify-end" :class="color">
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

const formattedDate = computed(() => useFormatDate(props.date))

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

const color = computed(() =>
  sum.value >= 0
    ? 'text-emerald-600 dark:text-emerald-500'
    : 'text-tagRedwood-light'
)

const { currency } = useCurrency(sum)
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}

.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
