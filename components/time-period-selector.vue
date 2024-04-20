<template>
  <div class="divide-y divide-gray-200 dark:divide-gray-700">
    <div :class="activeYearTab">
      <div class="flex items-center justify-start space-x-2">
        <div class="w-14">
          year
        </div>
        <div v-for="year in years" :key="year">
          <UButton :label="year" :ui="{ rounded: 'rounded-full' }" @click="isActive = !isActive" />
        </div>
      </div>
    </div>
    <div v-if="isActive" :class="activeMonthTab">
      <div class="flex items-center justify-start space-x-2">
        <div class="w-14">
          month
        </div>
        <div v-for="month in months" :key="month">
          <UButton :label="month" :ui="{ rounded: 'rounded-full' }" class="flex w-[42px] justify-center" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const isActive = ref(true)

const years = computed(() => Array.from({ length: 9 }, (_, index) => (new Date().getFullYear() - 1 + index).toString()))
const months = computed(() => [...Array(12)].map((_, index) => new Date(0, index).toLocaleString('en-US', { month: 'short' }).toLowerCase()))

const activeYearTab = computed(() => {
  return isActive.value ? 'pb-4' : ''
})

const activeMonthTab = computed(() => {
  return isActive.value ? 'pt-4' : ''
})

</script>
