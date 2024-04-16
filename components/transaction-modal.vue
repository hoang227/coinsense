<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        add transaction
      </template>
      <UForm ref="form" :state="state" :schema="schema" @submit="save">
        <UFormGroup label="transaction type" :required="true" name="type" class="mb-4">
          <USelect v-model="state.type" placeholder="select transaction type" :options="types" />
        </UFormGroup>

        <UFormGroup label="amount" :required="true" name="amount" class="mb-4">
          <UInput v-model.number="state.amount" type="number" placeholder="amount" />
        </UFormGroup>

        <UFormGroup label="date" :required="true" name="created_at" class="mb-4">
          <UInput v-model="state.created_at" type="date" placeholder="amount" icon="i-heroicons-calendar-days-20-solid" />
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
import { types, tags } from '~/constants'

const props = defineProps({
  modelValue: Boolean
})

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
  tag: z.enum(tags as [string, ...[string]])
})
const savingsSchema = z.object({
  type: z.literal('savings')
})
const investmentSchema = z.object({
  type: z.literal('investment')
})

const schema = z.intersection(
  z.discriminatedUnion('type', [incomeSchema, expenseSchema, savingsSchema, investmentSchema]),
  defaultSchema
)

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
        ...state.value
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

const state = ref({
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  tag: undefined
})

const resetForm = () => {
  // Object.assign(state.value, initialState)
  form.value.clear()
}
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    resetForm()
    emit('update:modelValue', value)
  }
})

</script>
