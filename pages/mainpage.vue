<template>
  <div>
    <div class="-mx-6 my-6 rounded-2xl bg-gray-100 p-4 dark:bg-gray-800">
      <div class="-mx-4 flex items-center justify-between">
        <TimePeriodSelector />

        <div class="mr-4 flex justify-between space-x-4">
          <div class="flex space-x-4">
            <UButton
              v-if="showTags"
              :ui="customButton"
              color="emerald"
              label="hide tags"
              variant="solid"
              @click="showTags = !showTags"
            />
            <UButton
              v-else
              :ui="customButton"
              color="redwood"
              label="show tags"
              variant="solid"
              @click="showTags = !showTags"
            />
          </div>
          <div>
            <TransactionModal
              v-model="isOpen"
              @saved="refresh(useTimePeriodStore().getState)"
            />
            <UButton
              :ui="customButton"
              color="emerald"
              icon="i-heroicons-plus-circle"
              label="add transaction"
              variant="solid"
              @click="isOpen = true"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="-mx-6 my-6 rounded-2xl bg-gray-100 p-4 dark:bg-gray-800">
      <div class="mb-5 flex items-center justify-between">
        <h2 class="ml-1">Accounts</h2>
      </div>

      <div
        class="grid grid-cols-1 pb-3 max-[900px]:gap-y-10 min-[900px]:grid-cols-2 min-[900px]:gap-x-10 min-[900px]:gap-y-6"
      >
        <div v-for="account in useAccountsStore().getAccounts" :key="account">
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

    <div class="-mx-6 my-6 rounded-2xl bg-gray-100 p-4 dark:bg-gray-800">
      <h2 class="my-4">Transactions</h2>

      <div v-if="!loading">
        <div
          v-for="(transactionsOnDay, date) in byDate"
          :key="date"
          class="mb-10"
        >
          <DailyTransactionSummary
            :date="date"
            :transactions="transactionsOnDay"
          />
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
const showTags = ref(true)

const {
  loading,
  firstFetch,
  refresh,
  analytics,
  currTransactions: {
    grouped: { byDate }
  }
} = useFetchTransactions(current, previous)
await firstFetch()

watch(timePeriod, async () => await refresh(timePeriod.getState))

const getAnalytics = (account: string) => {
  if (!analytics.value.accounts.includes(account)) {
    return {
      currIncome: 0,
      currExpense: 0,
      prevIncome: 0,
      prevExpense: 0
    }
  }
  return {
    currIncome: analytics.value.currAnalytics[account].income,
    currExpense: analytics.value.currAnalytics[account].expense,
    prevIncome: analytics.value.prevAnalytics[account].income,
    prevExpense: analytics.value.prevAnalytics[account].expense
  }
}

const customButton = {
  color: {
    emerald: {
      solid:
        'ring-1 ring-inset ring-emerald-600 dark:ring-emerald-500 text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-white dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:disabled:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-500'
    },
    redwood: {
      solid:
        'ring-1 ring-inset ring-tagRedwood-light text-white bg-tagRedwood-light hover:bg-tagRedwood-dark disabled:bg-white dark:bg-tagRedwood-dark dark:hover:bg-tagRedwood-light dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-tagRedwood-dark dark:focus-visible:ring-tagRedwood-light'
    }
  }
}
</script>
