<template>
  <div
    class="grid grid-cols-5 border-b border-neutral-300 py-4 text-gray-900 dark:border-gray-700 dark:text-gray-100"
  >
    <div class="col-span-4 flex items-center justify-between space-x-4">
      <div>
        <div class="mb-2 flex items-center space-x-2">
          <UIcon :name="icon" :class="iconColor" />
          <div>{{ transaction.description }}</div>
        </div>
        <div v-if="showTags" class="flex items-center justify-start">
          <div v-for="tag in transaction.tags" :key="`${tag.name as string}`">
            <UBadge
              :ui="customBadge"
              :color="tag.color"
              class="ml-[20px] rounded-full px-3.5 py-1.5"
            >
              <span class="truncate">{{ tag.name }}</span>
            </UBadge>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-end space-x-2">
      <div>
        {{ currency }}
      </div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            color="white"
            variant="ghost"
            trailing-icon="i-heroicons-ellipsis-horizontal"
            :loading="isLoading"
          />
          <TransactionModal
            v-model="isOpen"
            :transaction="transaction"
            @saved="emit('edited')"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  transaction: {
    type: Object as () => Transaction,
    required: true
  },
  showTags: Boolean
})

const emit = defineEmits(['deleted', 'edited'])

const isIncome = computed(() => props.transaction.type === 'income')

const icon = computed(() =>
  isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left'
)

const iconColor = computed(() =>
  isIncome.value
    ? 'text-emerald-600 dark:text-emerald-500'
    : 'text-tagRedwood-light'
)

const { currency } = useCurrency(props.transaction.amount)

const isLoading = ref(false)
const { toastSuccess, toastError } = useAppToast()
const supabase = useSupabaseClient()

const isOpen = ref(false)

const deleteTransaction = async () => {
  isLoading.value = true

  try {
    await supabase.from('transactions').delete().eq('id', props.transaction.id)
    toastSuccess({
      title: 'transaction deleted'
    })
    emit('deleted', props.transaction.id)
  } catch (error) {
    toastError({
      title: 'transaction not deleted'
    })
  } finally {
    isLoading.value = false
  }
}

const items = [
  [
    {
      label: 'edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => {
        isOpen.value = true
      }
    }
  ],
  [
    {
      label: 'delete',
      icon: 'i-heroicons-trash-20-solid',
      click: deleteTransaction
    }
  ]
]

const customBadge = {
  color: {
    cashew: {
      solid: 'bg-tagCashew-light dark:bg-tagCashew-light'
    },
    brass: {
      solid: 'bg-tagBrass-light dark:bg-tagBrass-light'
    },
    redwood: {
      solid: 'bg-tagRedwood-light dark:bg-tagRedwood-light'
    },
    leather: {
      solid: 'bg-tagLeather-light dark:bg-tagLeather-light'
    },
    apricot: {
      solid: 'bg-tagApricot-light dark:bg-tagApricot-light'
    },
    camel: {
      solid: 'bg-tagCamel-light dark:bg-tagCamel-light'
    },
    ocean: {
      solid: 'bg-tagOcean-light dark:bg-tagOcean-light'
    },
    night: {
      solid: 'bg-tagNight-light dark:bg-tagNight-light'
    }
  }
}
</script>
