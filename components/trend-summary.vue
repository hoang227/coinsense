<template>
  <div>
    <div class="font-bold bg-stone-200 dark:bg-gray-900 py-1 mb-1 pl-2 rounded-md" :class="color">
      {{ title }}
    </div>

    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton v-if="loading" class="h-8 w-full" :ui="{ background:'dark:bg-gray-700' }" />
      <div v-else>
        {{ currency }}
      </div>
    </div>

    <div>
      <USkeleton v-if="loading" class="h-6 w-full" :ui="{ background:'dark:bg-gray-700' }" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon :name="icon" class="w-6 h-6" :class="{ 'green': trendingUp, 'red': !trendingUp }" />
        <div class="text-gray-500 dark:text-gray-400">
          <span class="font-bold text-black dark:text-white">{{ percentageTrend }}</span> vs last period
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: 'transaction'
  },
  amount: {
    type: Number,
    default: 0
  },
  lastAmount: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: 'green'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const { amount } = toRefs(props)

const trendingUp = computed(
  () => props.amount && props.lastAmount && props.amount >= props.lastAmount
)

const { currency } = useCurrency(amount)

const icon = computed(
  () => trendingUp.value ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'
)

const percentageTrend = computed(() => {
  if (props.amount === 0 || props.lastAmount === 0) { return '∞%' }

  const bigger = Math.max(props.amount ?? 0, props.lastAmount ?? 0)
  const smaller = Math.min(props.amount ?? 0, props.lastAmount ?? 0)

  const ratio = ((bigger - smaller) / smaller) * 100

  return `${Math.ceil(ratio)}%`
})

</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400
}

.red {
  @apply text-red-600 dark:text-red-400
}

.blue {
  @apply text-blue-600 dark:text-blue-400
}

.yellow {
  @apply text-yellow-600 dark:text-yellow-400
}
</style>
