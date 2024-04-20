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

// TODO: remove hard coded date
const state = ref({
  month: (new Date().getMonth() + 1).toString(),
  year: new Date().getFullYear().toString()
})

const currFocus = useTimePeriodStore()

const yearFocus = () => {
  const month = `.month-${months.value[parseInt(state.value.month) - 1]}`
  const year = `.year-${state.value.year}`

  if (currFocus.month !== '' && currFocus.year !== '') {
    const currFocusMonth = document.querySelector(currFocus.month)
    const currFocusYear = document.querySelector(currFocus.year)

    currFocusMonth?.classList.remove('focus')
    currFocusYear?.classList.remove('focus')
  }

  const focusMonth = document.querySelector(month)
  const focusYear = document.querySelector(year)

  focusMonth?.classList.add('focus')
  focusYear?.classList.add('focus')

  currFocus.month = month
  currFocus.year = year
}

const handleYearClicked = (yearClicked: string) => {
  if (yearClicked === state.value.year) {
    state.value.month = '' // in year mode
    isActive.value = !isActive.value
  } else {
    state.value.month = ''
    state.value.year = yearClicked
    isActive.value = true
  }
  printState()
  yearFocus()
}

const handleMonthClicked = (monthClicked: string) => {
  const monthMap : {[month: string]: string} = {}
  months.value.forEach((month, index) => {
    monthMap[month] = (index + 1).toString()
  })
  if (monthMap[monthClicked] !== state.value.month) {
    state.value.month = monthMap[monthClicked]
  }
  printState()
  yearFocus()
}

function printState () {
  console.log('month:', state.value.month, typeof state.value.month)
  console.log('year:', state.value.year, typeof state.value.year)
  console.log('\n\n\n')
}

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
