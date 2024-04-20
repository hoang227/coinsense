<template>
  <div class="divide-y divide-gray-200 dark:divide-gray-700">
    <div :class="activeYearTab">
      <div class="flex items-center justify-start space-x-2">
        <div class="w-14">
          year
        </div>
        <div v-for="year in years" :key="year">
          <UButton
            :class="'year-' + year"
            :label="year"
            :ui="customButton"
            color="black"
            variant="solid"
            @click="handleYearClicked(year)"
          />
        </div>
      </div>
    </div>
    <div v-if="isActive" :class="activeMonthTab">
      <div class="flex items-center justify-start space-x-2">
        <div class="w-14">
          month
        </div>
        <div v-for="month in months" :key="month">
          <UButton
            :class="'month-' + month"
            :label="month"
            :ui="customButton"
            class="flex w-[42px] justify-center"
            color="black"
            variant="solid"
            @click="handleMonthClicked(month)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const isActive = ref(false)

// compute years and months
const years = computed(() => Array.from({ length: 9 }, (_, index) => (2024 - 1 + index).toString()))
const months: Ref<string[]> = computed(() => [...Array(12)].map((_, index) => new Date(0, index).toLocaleString('en-US', { month: 'short' }).toLowerCase()))

const activeYearTab = computed(() => {
  return isActive.value ? 'pb-4' : ''
})

const activeMonthTab = computed(() => {
  return isActive.value ? 'pt-4' : ''
})

const currFocus = useTimePeriodStore()

const state = {
  month: currFocus.getMonth,
  year: currFocus.getYear
}

const yearFocus = () => {
  // remove old focus
  const prevFocusMonth = `.month-${months.value[parseInt(currFocus.month)]}`
  const prevFocusYear = `.year-${currFocus.year}`

  const monthElement = document.querySelector(prevFocusMonth)
  const yearElement = document.querySelector(prevFocusYear)

  monthElement?.classList.remove('focus')
  yearElement?.classList.remove('focus')

  // add new focus
  const currFocusMonth = `.month-${months.value[state.month]}`
  const currFocusYear = `.year-${state.year}`

  const focusMonth = document.querySelector(currFocusMonth)
  const focusYear = document.querySelector(currFocusYear)

  focusMonth?.classList.add('focus')
  focusYear?.classList.add('focus')

  currFocus.setMonth(state.month.toString())
  currFocus.setYear(state.year)
}

const handleYearClicked = (yearClicked: string) => {
  if (yearClicked === state.year) {
    state.month = -1 // in year mode
    isActive.value = !isActive.value
  } else {
    state.month = -1
    state.year = yearClicked
    isActive.value = true
  }
  // printState()
  yearFocus()
}

const handleMonthClicked = (monthClicked: string) => {
  const monthMap : {[month: string]: number} = {}
  months.value.forEach((month, index) => {
    monthMap[month] = index
  })
  if (monthMap[monthClicked] !== state.month) {
    state.month = monthMap[monthClicked]
  }
  // printState()
  yearFocus()
}

// function printState () {
//   console.log('month:', state.month, typeof state.month)
//   console.log('year:', state.year, typeof state.year)
//   console.log('\n\n\n')
// }

const customButton = {
  rounded: 'rounded-full',
  color: {
    black: {
      solid: 'bg-white text-gray-900 hover:bg-green-500 dark:hover:bg-green-400'
    }
  }
}

</script>

<style scoped>

.focus {
  @apply bg-green-500 dark:bg-green-400
}

</style>
