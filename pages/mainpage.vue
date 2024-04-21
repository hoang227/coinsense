<template>
  <div>
    <div class="section">
      <div class="flex justify-between items-center -mx-4">
        <TimePeriodSelector />

        <div class="mr-4 flex justify-between space-x-4">
          <div class="flex space-x-4">
            <UButton v-if="showTags" color="red" variant="solid" label="hide tags" @click="showTags = !showTags" />
            <UButton v-else color="green" variant="solid" label="show tags" @click="showTags = !showTags" />
          </div>
          <div>
            <TransactionModal v-model="isOpen" @saved="refresh(useTimePeriodStore().getState)" />
            <UButton icon="i-heroicons-plus-circle" color="green" variant="solid" label="add transaction" @click="isOpen = true" />
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="flex justify-between items-center mb-5">
        <h2 class="ml-1">
          Accounts
        </h2>
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
    </div>

    <div class="section">
      <h2 class="my-4">
        Transactions
      </h2>

      <div v-if="!loading">
        <div v-for="(transactionsOnDay, date) in byDate" :key="date" class="mb-10">
          <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
          <SingleTransaction
            v-for="transaction in transactionsOnDay"
            :key="transaction.id"
            :show-tags="showTags"
            :transaction="transaction"
            @deleted="refresh(useTimePeriodStore().getState)"
            @edited="refresh(useTimePeriodStore().getState)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const timePeriod = useTimePeriodStore()
const { current, previous } = useSelectedTimePeriod(timePeriod.getState)
const isOpen = ref(false)
const showTags = ref(false)

const {
  loading, firstFetch, refresh, analytics,
  currTransactions: {
    grouped: {
      byDate
    }
  }
} = useFetchTransactions(current, previous)
await firstFetch()

watch(timePeriod, async () => await refresh(timePeriod.getState))

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
  @apply  grid grid-cols-1 min-[900px]:grid-cols-2 min-[900px]:gap-10 max-[900px]:gap-y-10
}

.section {
  @apply shadow-md shadow-neutral-400 bg-neutral-100 dark:bg-neutral-800 -mx-6 p-4 my-6 rounded-2xl
}
</style>
