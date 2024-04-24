<template>
  <div>
    <h3 class="account">
      <button
        :class="isPinnedStyle"
        class="flex justify-between items-center w-full px-2 py-1 text-left rounded-lg hover:bg-neutral-700 hover:text-neutral-200"
        @click="isPinned = !isPinned"
        @mouseenter="isOpen = true"
        @mouseleave="isOpen = false"
      >
        <div>
          {{ account }}
        </div>
        <UIcon :name="accountIcon" />
      </button>
    </h3>
    <Transition name="summary">
      <div v-if="isPinned ? true : isOpen">
        <div class="balance">
          <div>
            Balance
          </div>
          <div :class="{ 'red': isBroke, 'green': !isBroke }">
            {{ balance?.currency }}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-10">
          <div class="type-box">
            <div class="text-xl font-extrabold text-black dark:text-white mb-2">
              <div class="font-bold green">
                Income
              </div>
              <USkeleton v-if="loading" class="amount-skeleton" :ui="{ rounded: 'bg-stone-200 dark:bg-gray-700' }" />
              <div v-else class="mr-2 h-8">
                {{ income?.currency }}
              </div>
            </div>
            <div>
              <USkeleton v-if="loading" class="trend-skeleton" :ui="{ rounded: 'bg-stone-200 dark:bg-gray-700' }" />
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

          <div class="type-box">
            <div class="text-xl font-extrabold text-black dark:text-white mb-2">
              <div class="font-bold red">
                Expenses
              </div>
              <USkeleton v-if="loading" class="amount-skeleton" :ui="{ rounded: 'bg-stone-200 dark:bg-gray-700' }" />
              <div v-else class="mr-2 h-8">
                {{ expense.currency }}
              </div>
            </div>
            <div>
              <USkeleton v-if="loading" class="trend-skeleton" :ui="{ rounded: 'bg-stone-200 dark:bg-gray-700' }" />
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
    </Transition>
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

const isPinned = ref(false)
const isOpen = ref(false)

const accountIcon = computed(() => { return isPinned.value ? 'i-heroicons-chevron-down' : isOpen.value ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-up' })

const isPinnedStyle = computed(() => { return isPinned.value ? 'bg-neutral-700 text-neutral-200' : 'bg-neutral-200' })

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

.account {
  @apply shadow-md shadow-neutral-400 font-bold text-2xl dark:bg-gray-700 bg-neutral-200 rounded-lg mb-3
}

.balance {
  @apply shadow-md shadow-neutral-400 flex items-center justify-between font-bold text-xl bg-neutral-200 dark:bg-gray-900 px-2 py-1 rounded-lg mb-3
}

.type-box {
  @apply shadow-md shadow-neutral-400  bg-neutral-200 dark:bg-gray-900 rounded-lg pl-2 pt-2 pb-4 min-[1300px]:pb-1 min-[1300px]:flex min-[1300px]:items-center min-[1300px]:justify-start min-[1300px]:gap-2
}

.amount-skeleton {
  @apply h-8 mr-2 min-[1300px]:w-24
}

.trend-skeleton {
  @apply h-9 mr-2 min-[1300px]:w-24 min-[1300px]:-ml-2 min-[1300px]:h-14
}

.summary-enter-active {
  transform-origin: top;
  animation: expand-down 0.7s;
}
@keyframes expand-down {
  0% {
    transform: scaleY(0);
  }
  50% {
    transform: scaleY(1.04);
  }
  100% {
    transform: scaleY(1);
  }
}

.summary-enter-from,
.summary-leave-to {
  opacity: 0;
}
</style>
