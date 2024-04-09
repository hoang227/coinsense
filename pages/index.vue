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

    <section>
      <div>
        <SingleTransaction :transaction="transaction1" />
        <SingleTransaction :transaction="transaction2" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import TrendSummary from '~/components/trend-summary.vue'
import { transactionViewOptions } from '~/constants'

const selectedView = ref(transactionViewOptions[1])

const transaction1 = {
  description: 'desc1',
  tag: 'cat1',
  amount: 1000,
  type: 'income'
}
const transaction2 = {
  description: 'desc2',
  tag: 'cat2',
  amount: 2000,
  type: 'expense'
}

</script>
