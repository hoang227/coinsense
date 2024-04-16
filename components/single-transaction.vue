<template>
  <div class="grid grid-cols-5 py-4 border-b border-stone-100 dark:border-gray-700 text-gray-900 dark:text-gray-100">
    <div class="flex items-center justify-between space-x-4 col-span-4">
      <div>
        <div class="flex items-center space-x-2 mb-2">
          <UIcon :name="icon" :class="iconColor" />
          <div>{{ transaction.description }}</div>
        </div>
        <UBadge v-if="showTags && transaction.tag && !isNoneTag" color="white" class="ml-[20px] px-3.5 py-1.5">
          {{ transaction.tag }}
        </UBadge>
      </div>
    </div>
    <div class="flex items-center justify-end space-x-2">
      <div>
        {{ currency }}
      </div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton color="white" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal" :loading="isLoading" />
          <TransactionModal v-model="isOpen" :transaction="transaction" @saved="emit('edited')" />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  transaction: {
    type: Object,
    required: true
  },
  showTags: Boolean
})

const toast = useToast()

const emit = defineEmits(['deleted', 'edited'])

const isIncome = computed(() => props.transaction.type === 'income')

const isNoneTag = computed(() => props.transaction.tag === 'none')

const icon = computed(
  () => isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left'
)

const iconColor = computed(
  () => isIncome.value ? 'text-green-600' : 'text-red-600'
)

const { currency } = useCurrency(props.transaction.amount)

const isLoading = ref(false)
const { toastSuccess, toastError } = useAppToast()
const supabase = useSupabaseClient()

const isOpen = ref(false)

const deleteTransaction = async () => {
  isLoading.value = true

  try {
    await supabase
      .from('transactions')
      .delete()
      .eq('id', props.transaction.id)

    toast.add({
      title: 'transaction deleted',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
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
  [{
    label: 'edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => { isOpen.value = true }
  }],
  [{
    label: 'delete',
    icon: 'i-heroicons-trash-20-solid',
    click: deleteTransaction
  }]
]
</script>
