<template>
  <div>
    <section>
      <div class="flex justify-between items-center mb-5">
        <h1 class="ml-1 text-3xl font-extrabold">
          accounts
        </h1>
      </div>

      <div class="summary-grid">
        <div v-for="account in analytics.accounts" :key="account" class="">
          <AccountSummary
            :curr-income="getAnalytics(account).currIncome"
            :curr-expense="getAnalytics(account).currExpense"
            :prev-income="getAnalytics(account).prevIncome"
            :prev-expense="getAnalytics(account).prevExpense"
            :account="account"
            :loading="loading"
          />
        </div>
      </div>
    </section>

    <section>
      <TimePeriodSelector />
    </section>

    <section>
      <div class="flex justify-between">
        <div class="flex space-x-4">
          <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
          <UButton v-if="showTags" color="red" variant="solid" label="hide tags" @click="showTags = !showTags" />
          <UButton v-else color="green" variant="solid" label="show tags" @click="showTags = !showTags" />
        </div>
        <div>
          <TransactionModal v-model="isOpen" @saved="refresh()" />
          <UButton icon="i-heroicons-plus-circle" color="green" variant="solid" label="add transaction" @click="isOpen = true" />
        </div>
      </div>
    </section>

    <section v-if="!loading">
      <div v-for="(transactionsOnDay, date) in byDate" :key="date" class="mb-10">
        <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
        <SingleTransaction
          v-for="transaction in transactionsOnDay"
          :key="transaction.id"
          :show-tags="showTags"
          :transaction="transaction"
          @deleted="refresh()"
          @edited="refresh()"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { transactionViewOptions } from '~/constants'

const selectedView = ref(transactionViewOptions[0])
const timePeriod = useTimePeriodStore()
const { current, previous } = useSelectedTimePeriod(timePeriod.getState)
const isOpen = ref(false)
const showTags = ref(false)

console.log(timePeriod.getState)

const {
  loading, refresh, analytics,
  currTransactions: {
    grouped: {
      byDate
    }
  }
} = useFetchTransactions(current, previous)
await refresh()

const getAnalytics = (account: string) => {
  return {
    currIncome: analytics.value.currAnalytics[account].income,
    currExpense: analytics.value.currAnalytics[account].expense,
    prevIncome: analytics.value.prevAnalytics[account].income,
    prevExpense: analytics.value.prevAnalytics[account].expense
  }
}

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

.summary-grid {
  @apply  grid grid-cols-1 min-[900px]:grid-cols-2 min-[900px]:gap-10 max-[900px]:divide-y-[30px] max-[900px]:divide-gray-800
}

section {
  @apply shadow-xl bg-stone-300 dark:bg-gray-800 -mx-6 p-4 my-6 rounded-2xl
}
</style>
