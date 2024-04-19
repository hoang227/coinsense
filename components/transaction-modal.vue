<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        add transaction
      </template>
      <UForm ref="form" :state="state" :schema="schema" @submit="save">
        <UFormGroup label="transaction type" :required="true" name="type" class="mb-4">
          <USelect v-model="state.type" :disabled="isEditing" placeholder="select transaction type" :options="types" />
        </UFormGroup>

        <UFormGroup label="account" :required="true" name="account" class="mb-4">
          <USelect v-model="state.account" placeholder="select account" :options="accounts" />
        </UFormGroup>

        <UFormGroup label="amount" :required="true" name="amount" class="mb-4">
          <UInput v-model.number="state.amount" type="number" placeholder="amount" />
        </UFormGroup>

        <UFormGroup label="date" :required="true" name="created_at" class="mb-4">
          <UInput v-model="state.created_at" type="date" placeholder="amount" icon="i-heroicons-calendar-days-20-solid" />
          <UButton class="-ml-2 opacity-60" label="today" color="black" variant="link" @click="setDateToToday" />
          <UButton class="-ml-2 opacity-60" label="clear" color="black" variant="link" @click="clearDate" />
          <UButton class="-ml-2 opacity-60" label="stubIncome" color="black" variant="link" @click="addStubIncome" />
          <UButton class="-ml-2 opacity-60" label="stubExpense" color="black" variant="link" @click="addStubExpense" />
        </UFormGroup>

        <UFormGroup label="description" name="description" class="mb-4">
          <UInput v-model="state.description" placeholder="description" />
        </UFormGroup>

        <UFormGroup v-if="state.type==='expense'" label="tag" name="tag" class="mb-4">
          <USelect v-model="state.tag" placeholder="select tag" :options="tags" />
        </UFormGroup>

        <UButton type="submit" color="black" variant="solid" label="save" :loading="isLoading" />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { types, tags, accounts } from '~/constants'

const props = defineProps({
  modelValue: Boolean,
  transaction: {
    type: Object as () => Transaction,
    required: false,
    default: () => {}
  }
})

const isEditing = computed(() => !!props.transaction)
const emit = defineEmits([
  'update:modelValue',
  'saved'
])

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive('amount needs to be greater than 0')
})

const incomeSchema = z.object({
  type: z.literal('income')
})
const expenseSchema = z.object({
  type: z.literal('expense'),
  tag: z.enum(tags as [string, ...[string]]).optional()
})
const checkingSchema = z.object({
  account: z.literal('checking')
})
const savingSchema = z.object({
  account: z.literal('saving')
})

const tempSchema = z.intersection(
  z.discriminatedUnion('type', [incomeSchema, expenseSchema]),
  z.discriminatedUnion('account', [checkingSchema, savingSchema])
)

const schema = z.intersection(tempSchema, defaultSchema)

const form = ref()
const isLoading = ref(false)
const supabase = useSupabaseClient()
const { toastSuccess, toastError } = useAppToast()

const save = async () => {
  if (form.value.errors.length) { return }

  isLoading.value = true
  try {
    const { error } = await supabase.from('transactions')
      .upsert({
        ...state.value,
        tag: state.value.tag ?? 'none',
        id: props.transaction?.id
      } as never)

    if (!error) {
      toastSuccess({
        title: 'transaction-saved'
      })
      isOpen.value = false
      emit('saved')
      return
    }
    throw (error)
  } catch (error) {
    toastError({
      title: 'transaction not saved',
      description: (error as Error).message
    })
  } finally {
    isLoading.value = false
  }
}

const initialState = isEditing.value
  ? {
      type: props.transaction.type,
      account: props.transaction.account,
      amount: props.transaction.amount,
      created_at: props.transaction.created_at.split('T')[0],
      description: props.transaction.description,
      tag: props.transaction.tag
    }
  : {
      type: undefined,
      account: undefined,
      amount: 0,
      created_at: undefined,
      description: undefined,
      tag: undefined
    }

const state = ref({ ...initialState })

const resetForm = () => {
  Object.assign(state.value, initialState)
  form.value.clear()
}
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) { resetForm() }
    emit('update:modelValue', value)
  }
})

const setDateToToday = () => {
  state.value.created_at = useDateTime(new Date())
}

const clearDate = () => {
  state.value.created_at = undefined
}

const addStubIncome = () => {
  state.value.type = 'income'
  state.value.account = 'checking'
  state.value.created_at = useDateTime(new Date())
  state.value.amount = 1000
  state.value.description = 'some income'
}
const addStubExpense = () => {
  state.value.type = 'expense'
  state.value.account = 'checking'
  state.value.created_at = useDateTime(new Date())
  state.value.amount = 1000
  state.value.description = 'some expense'
  state.value.tag = 'food'
}

</script>
