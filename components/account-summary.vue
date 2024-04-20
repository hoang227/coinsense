<template>
  <div>
    <div class="shadow-inner font-bold text-2xl dark:bg-gray-700 bg-stone-100 px-2 py-1 rounded-lg mb-3">
      {{ account }}
    </div>
    <div class="shadow-inner flex items-center justify-between font-bold text-xl bg-stone-400 dark:bg-gray-900 px-2 py-1 rounded-lg mb-3">
      <div>
        balance
      </div>
      <div :class="{ 'red': isBroke, 'green': !isBroke }">
        {{ balance?.currency }}
      </div>
    </div>
    <div class="grid grid-cols-2 gap-10">
      <div class="shadow-inner bg-stone-400 dark:bg-gray-900 rounded-lg pl-2 pt-2 pb-4 min-[1300px]:pb-1 min-[1300px]:flex min-[1300px]:items-center min-[1300px]:justify-start min-[1300px]:gap-4">
        <div class="text-xl font-extrabold text-black dark:text-white mb-2">
          <div class="font-bold green">
            income
          </div>
          <USkeleton v-if="loading" class="h-8 mr-2 min-[1300px]:w-24" :ui="{ rounded: 'bg-stone-200 dark:bg-gray-700' }" />
          <div v-else class="mr-2 h-8">
            {{ income?.currency }}
          </div>
        </div>
        <div>
          <USkeleton v-if="loading" class="h-9 mr-2 min-[1300px]:w-24 min-[1300px]:-ml-2 min-[1300px]:h-14" :ui="{ rounded: 'bg-stone-200 dark:bg-gray-700' }" />
          <div v-else class="flex flex-col items-start text-sm h-9 mr-2">
            <div class="flex items-center space-x-2">
              <UIcon :name="incomeIcon" class="size-6" :class="{ 'green': incomeTrendingUp, 'red': !incomeTrendingUp }" />
              <div class="font-bold">
                {{ incomePercentageTrend }}
              </div>
            </div>
            <div class="text-stone-500 dark:text-gray-400">vs last period</div>
          </div>
        </div>
      </div>

      <div class="shadow-inner bg-stone-400 dark:bg-gray-900 rounded-lg pl-2 pt-2 pb-4 min-[1300px]:pb-1 min-[1300px]:flex min-[1300px]:items-center min-[1300px]:justify-start min-[1300px]:gap-4">
        <div class="text-xl font-extrabold text-black dark:text-white mb-2">
          <div class="font-bold red">
            expenses
          </div>
          <USkeleton v-if="loading" class="h-8 mr-2 min-[1300px]:w-24" :ui="{ rounded: 'bg-stone-200 dark:bg-gray-700' }" />
          <div v-else class="mr-2 h-8">
            {{ expense.currency }}
          </div>
        </div>
        <div>
          <USkeleton v-if="loading" class="h-9 mr-2 min-[1300px]:w-24 min-[1300px]:-ml-2 min-[1300px]:h-14" :ui="{ rounded: 'bg-stone-200 dark:bg-gray-700' }" />
          <div v-else class="flex flex-col items-start text-sm h-9 mr-2">
            <div class="flex items-center space-x-2">
              <UIcon :name="expenseIcon" class="size-6" :class="{ 'red': expenseTrendingUp, 'green': !expenseTrendingUp }" />
              <div class="font-bold">
                {{ expensePercentageTrend }}
              </div>
            </div>
            <div class="text-stone-500 dark:text-gray-400">vs last period</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  currIncome: {
    type: Number,
    required: true
  },
  currExpense: {
    type: Number,
    required: true
  },
  prevIncome: {
    type: Number,
    required: true
  },
  prevExpense: {
    type: Number,
    required: true
  },
  account: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
})

const income = computed(() => useCurrency(props.currIncome))
const expense = computed(() => useCurrency(props.currExpense))

const balance = computed(() => useCurrency(props.currIncome - props.currExpense))

const isBroke = computed(() => props.currIncome < props.currExpense)

const incomeTrendingUp = computed(
  () => props.currIncome >= props.prevIncome
)
const expenseTrendingUp = computed(
  () => props.currExpense >= props.prevExpense
)

const incomeIcon = computed(
  () => incomeTrendingUp.value ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'
)
const expenseIcon = computed(
  () => expenseTrendingUp.value ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'
)

const incomePercentageTrend = computed(() => {
  if (props.currIncome === 0 || props.prevIncome === 0) { return '∞%' }

  const bigger = Math.max(props.currIncome, props.prevIncome)
  const smaller = Math.min(props.currIncome, props.prevIncome)

  const ratio = ((bigger - smaller) / smaller) * 100

  return `${Math.ceil(ratio)}%`
})

const expensePercentageTrend = computed(() => {
  if (props.currExpense === 0 || props.prevExpense === 0) { return '∞%' }

  const bigger = Math.max(props.currExpense, props.prevExpense)
  const smaller = Math.min(props.currExpense, props.prevExpense)
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
