<template>
  <div>
    <section class="flex justify-between items-center mb-10">
      <h1 class="text-4xl font-extrabold">
        summary
      </h1>
      <div>
        <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
      </div>
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
      <TrendSummary title="income" :amount="10000" :last-amount="9000" color="green" :loading="false" />
      <TrendSummary title="expense" :amount="3000" :last-amount="3500" color="red" :loading="false" />
      <TrendSummary title="savings" :amount="100" :last-amount="200" color="yellow" :loading="false" />
      <TrendSummary title="investment" :amount="100" :last-amount="200" color="blue" :loading="false" />
    </section>

    <section v-if="!pending">
      <div v-for="(transactionsOnDay, date) in transactionsGroupedByDate" :key="date" class="mb-8">
        <SingleTransaction v-for="transaction in transactionsOnDay" :key="transaction.id" :transaction="transaction" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { transactionViewOptions } from '~/constants'

const selectedView = ref(transactionViewOptions[1])
// const {
//   pending, refresh, transactions: {
//     income,
//     expense,
//     savings,
//     investment,
//     incomeCount,
//     expenseCount,
//     savingsCount,
//     investmentCount,
//     incomeTotal,
//     expenseTotal,
//     savingsTotal,
//     investmentTotal,
//     grouped: {
//       byDate
//     }
//   }
// } = useFetchTransactions()
// await refresh()

const supabase = useSupabaseClient()

const transactions = ref<Transaction[]>([])

const { data, pending } = await useAsyncData('transactions', async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select()

  if (error) { return [] }

  return data as Transaction[]
})

if (data.value) {
  transactions.value = data.value as Transaction[]
}

const transactionsGroupedByDate = computed(() => {
  const grouped = {} as Record<string, Transaction[]>

  for (const transaction of transactions.value) {
    if (transaction) {
      const date = (new Date(transaction.created_at ?? 0)).toISOString().split('T')[0]

      if (!grouped[date]) {
        grouped[date] = []
      }

      grouped[date].push(transaction)
    }
  }

  return grouped
})

</script>
