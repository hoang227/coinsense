<template>
  <div>
    <h3 class="mb-3 rounded-lg bg-gray-200 text-2xl font-bold dark:bg-gray-700">
      <button
        :class="isPinnedStyle"
        class="flex w-full items-center justify-between rounded-t-lg px-2 py-1 text-left hover:bg-gray-700 hover:text-white dark:hover:bg-gray-700"
        @click="isPinned = !isPinned"
        @mouseenter="isOpen = true"
        @mouseleave="isOpen = false"
      >
        <div>
          {{ account }}
        </div>
        <UIcon :name="accountIcon" />
      </button>
      <div
        :class="balanceColor"
        class="rounded-b-lg bg-gray-200 px-2 py-1 text-xl font-bold dark:bg-gray-900"
      >
        {{ balance?.currency }}
      </div>
    </h3>
    <Transition name="summary">
      <div v-if="isPinned ? true : isOpen">
        <div class="grid grid-cols-2 gap-10">
          <div
            class="rounded-lg bg-gray-200 pb-4 pl-2 pt-2 dark:bg-gray-900 min-[1300px]:flex min-[1300px]:items-center min-[1300px]:justify-start min-[1300px]:gap-2 min-[1300px]:pb-1"
          >
            <div class="mb-2 text-xl font-extrabold text-black dark:text-white">
              <div class="font-bold text-emerald-600 dark:text-emerald-500">
                Income
              </div>
              <USkeleton
                v-if="loading"
                class="mr-2 h-8 min-[1300px]:w-24"
                :ui="{ rounded: 'bg-gray-200 dark:bg-gray-700' }"
              />
              <div v-else class="mr-2 h-8">
                {{ income?.currency }}
              </div>
            </div>
            <div>
              <USkeleton
                v-if="loading"
                class="mr-2 h-9 min-[1300px]:-ml-2 min-[1300px]:h-14 min-[1300px]:w-24"
                :ui="{ rounded: 'bg-gray-200 dark:bg-gray-700' }"
              />
              <div v-else class="mr-2 flex h-9 flex-col items-start text-sm">
                <div class="flex items-center space-x-2">
                  <UIcon
                    :name="incomeIcon"
                    class="size-6"
                    :class="{
                      'text-emerald-600 dark:text-emerald-500':
                        incomeTrendingUp,
                      'text-tagRedwood-light': !incomeTrendingUp
                    }"
                  />
                  <div class="font-bold">
                    {{ incomePercentageTrend }}
                  </div>
                </div>
                <div class="text-gray-500 dark:text-gray-400">
                  vs last period
                </div>
              </div>
            </div>
          </div>

          <div
            class="rounded-lg bg-gray-200 pb-4 pl-2 pt-2 dark:bg-gray-900 min-[1300px]:flex min-[1300px]:items-center min-[1300px]:justify-start min-[1300px]:gap-2 min-[1300px]:pb-1"
          >
            <div class="mb-2 text-xl font-extrabold text-black dark:text-white">
              <div class="text-tagRedwood-light font-bold">Expenses</div>
              <USkeleton
                v-if="loading"
                class="mr-2 h-8 min-[1300px]:w-24"
                :ui="{ rounded: 'bg-gray-200 dark:bg-gray-700' }"
              />
              <div v-else class="mr-2 h-8">
                {{ expense.currency }}
              </div>
            </div>
            <div>
              <USkeleton
                v-if="loading"
                class="mr-2 h-9 min-[1300px]:-ml-2 min-[1300px]:h-14 min-[1300px]:w-24"
                :ui="{ rounded: 'bg-gray-200 dark:bg-gray-700' }"
              />
              <div v-else class="mr-2 flex h-9 flex-col items-start text-sm">
                <div class="flex items-center space-x-2">
                  <UIcon
                    :name="expenseIcon"
                    class="size-6"
                    :class="{
                      'bg-tagRedwood-light': expenseTrendingUp,
                      'text-emerald-600 dark:text-emerald-500':
                        !expenseTrendingUp
                    }"
                  />
                  <div class="font-bold">
                    {{ expensePercentageTrend }}
                  </div>
                </div>
                <div class="text-gray-500 dark:text-gray-400">
                  vs last period
                </div>
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

const accountIcon = computed(() => {
  return isPinned.value
    ? 'i-heroicons-chevron-down'
    : isOpen.value
      ? 'i-heroicons-chevron-down'
      : 'i-heroicons-chevron-up'
})

const isPinnedStyle = computed(() => {
  return isPinned.value
    ? 'bg-gray-700 text-white'
    : 'bg-gray-200 dark:bg-gray-900'
})

const income = computed(() => useCurrency(props.currIncome))
const expense = computed(() => useCurrency(props.currExpense))

const balance = computed(() =>
  useCurrency(props.currIncome - props.currExpense)
)

const balanceColor = computed(() => {
  return props.currIncome < props.currExpense
    ? 'text-Redwood-light'
    : props.currIncome > props.currExpense
      ? 'text-emerald-600 dark:text-emerald-500'
      : ''
})

const incomeTrendingUp = computed(() => props.currIncome >= props.prevIncome)
const expenseTrendingUp = computed(() => props.currExpense >= props.prevExpense)

const incomeIcon = computed(() =>
  incomeTrendingUp.value
    ? 'i-heroicons-arrow-trending-up'
    : 'i-heroicons-arrow-trending-down'
)
const expenseIcon = computed(() =>
  expenseTrendingUp.value
    ? 'i-heroicons-arrow-trending-up'
    : 'i-heroicons-arrow-trending-down'
)

const incomePercentageTrend = computed(() => {
  if (props.currIncome === 0 || props.prevIncome === 0) {
    return '∞%'
  }

  const bigger = Math.max(props.currIncome, props.prevIncome)
  const smaller = Math.min(props.currIncome, props.prevIncome)

  const ratio = ((bigger - smaller) / smaller) * 100

  return `${Math.ceil(ratio)}%`
})

const expensePercentageTrend = computed(() => {
  if (props.currExpense === 0 || props.prevExpense === 0) {
    return '∞%'
  }

  const bigger = Math.max(props.currExpense, props.prevExpense)
  const smaller = Math.min(props.currExpense, props.prevExpense)
  const ratio = ((bigger - smaller) / smaller) * 100

  return `${Math.ceil(ratio)}%`
})
</script>

<style scoped>
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
