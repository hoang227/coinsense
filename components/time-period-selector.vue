<template>
  <div class="mx-4 flex items-center justify-start space-x-4">
    <div class="flex flex-col items-start justify-center">
      <div
        class="flex items-center justify-end space-x-1 pb-2 font-bold tracking-tight"
      >
        <div class="ml-2 text-green-500">
          {{ useTimePeriodStore().getYear }}
        </div>
        <div v-if="timeMode === 'Monthly'" class="w-[80px] text-neutral-700">
          {{ months[useTimePeriodStore().getMonth] }}
        </div>
        <div v-else class="w-[80px]" />
      </div>
      <div>
        <UButton
          color="white"
          icon="i-heroicons-chevron-left"
          size="xs"
          variant="ghost"
          @click="decreasePeriod"
        />
        <UButton
          color="white"
          icon="i-heroicons-chevron-right"
          size="xs"
          variant="ghost"
          @click="increasePeriod"
        />
      </div>
      <UButton
        class="ml-1 font-light text-neutral-500"
        label="now"
        color="white"
        variant="link"
        @click="setCurrPeriod"
      />
    </div>
    <UTabs class="pt-2" :ui="customTabs" :items="modes" @change="onChange" />
  </div>
</template>

<script setup lang="ts">
const currPeriod = useTimePeriodStore()

const timeMode = ref('Monthly')

const modes = [
  {
    label: 'Monthly'
  },
  {
    label: 'Yearly'
  }
]

const customTabs = {
  list: {
    background: 'bg-neutral-200 dark:bg-gray-800',
    tab: {
      font: 'font-light'
    }
  }
}

function onChange(index: any) {
  const mode = modes[index]
  timeMode.value = mode.label
  if (mode.label === 'Monthly') {
    currPeriod.setMonth(0)
  } else {
    currPeriod.setMonth(-1)
  }
}

// compute years and months
const months: Ref<string[]> = computed(() =>
  [...Array(12)].map((_, index) =>
    new Date(0, index).toLocaleString('en-US', { month: 'long' })
  )
)

const increasePeriod = () => {
  if (timeMode.value === 'Monthly') {
    if (currPeriod.getMonth === 11) {
      currPeriod.setYear(currPeriod.getYear + 1)
      currPeriod.setMonth(0)
    } else {
      currPeriod.setMonth(currPeriod.getMonth + 1)
    }
  } else {
    currPeriod.setYear(currPeriod.getYear + 1)
  }
}

const decreasePeriod = () => {
  if (timeMode.value === 'Monthly') {
    if (currPeriod.getMonth === 0) {
      currPeriod.setYear(currPeriod.getYear - 1)
      currPeriod.setMonth(11)
    } else {
      currPeriod.setMonth(currPeriod.getMonth - 1)
    }
  } else {
    currPeriod.setYear(currPeriod.getYear - 1)
  }
}

const setCurrPeriod = () => {
  if (timeMode.value === 'Monthly') {
    currPeriod.setMonth(new Date().getMonth())
    currPeriod.setYear(new Date().getFullYear())
  } else {
    currPeriod.setMonth(-1)
    currPeriod.setYear(new Date().getFullYear())
  }
}
</script>
