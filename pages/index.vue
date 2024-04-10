<template>
  <div>
    <section class="bg-stone-300 dark:bg-gray-800 -mx-6 p-4 my-6 rounded-2xl">
      <div class="flex justify-between items-center mb-10">
        <h1 class="text-4xl font-extrabold">
          summary
        </h1>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16">
        <TrendSummary
          :amount="incomeTotal"
          :count="incomeCount"
          :last-amount="9000"
          :loading="pending"
          color="green"
          title="income"
        />
        <TrendSummary
          :amount="expenseTotal"
          :count="expenseCount"
          :last-amount="3500"
          :loading="pending"
          color="red"
          title="expense"
        />
        <TrendSummary
          :amount="savingsTotal"
          :count="savingsCount"
          :last-amount="200"
          :loading="pending"
          color="yellow"
          title="savings"
        />
        <TrendSummary
          :amount="investmentTotal"
          :count="investmentCount"
          :last-amount="200"
          :loading="pending"
          color="blue"
          title="investment"
        />
      </div>
    </section>

    <section class="my-8">
      <div class="flex justify-between">
        <div>
          <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
        </div>
        <div>
          <UButton icon="i-heroicons-plus-circle" color="green" variant="solid" label="add transaction" />
        </div>
      </div>
    </section>

    <section v-if="!pending" class="bg-stone-300 dark:bg-gray-800 -mx-6 p-4 my-6 rounded-2xl">
      <div v-for="(transactionsOnDay, date) in byDate" :key="date" class="mb-8">
        <SingleTransaction v-for="transaction in transactionsOnDay" :key="transaction.id" :transaction="transaction" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { transactionViewOptions } from '~/constants'

const selectedView = ref(transactionViewOptions[1])
const {
  pending, refresh, transactions: {
    incomeCount,
    expenseCount,
    savingsCount,
    investmentCount,
    incomeTotal,
    expenseTotal,
    savingsTotal,
    investmentTotal,
    grouped: {
      byDate
    }
  }
} = useFetchTransactions()
await refresh()

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
