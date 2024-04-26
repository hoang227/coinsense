<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> add transaction </template>
      <UForm ref="form" :state="state" :schema="schema" @submit="save">
        <UFormGroup
          label="transaction type"
          :required="true"
          name="type"
          class="mb-4"
        >
          <USelect
            v-model="state.type"
            :disabled="isEditing"
            placeholder="select transaction type"
            :options="types"
          />
        </UFormGroup>

        <UFormGroup
          label="account"
          :required="true"
          name="account"
          class="mb-4"
        >
          <USelect
            v-model="state.account"
            placeholder="select account"
            :options="accounts"
          />
        </UFormGroup>

        <UFormGroup label="amount" :required="true" name="amount" class="mb-4">
          <UInput v-model="state.amount" placeholder="amount" />
        </UFormGroup>

        <UFormGroup
          label="date"
          :required="true"
          name="created_at"
          class="mb-4"
        >
          <UInput
            v-model="state.created_at"
            type="date"
            placeholder="amount"
            icon="i-heroicons-calendar-days-20-solid"
          />
          <UButton
            class="-ml-2 opacity-60"
            label="today"
            color="black"
            variant="link"
            @click="setDateToToday"
          />
          <UButton
            class="-ml-2 opacity-60"
            label="clear"
            color="black"
            variant="link"
            @click="clearDate"
          />
          <UButton
            class="-ml-2 opacity-60"
            label="stubIncome"
            color="black"
            variant="link"
            @click="addStubIncome"
          />
          <UButton
            class="-ml-2 opacity-60"
            label="stubExpense"
            color="black"
            variant="link"
            @click="addStubExpense"
          />
        </UFormGroup>

        <UFormGroup label="description" name="description" class="mb-4">
          <UInput v-model="state.description" placeholder="description" />
        </UFormGroup>

        <UFormGroup label="tag" name="tag" class="mb-4">
          <USelectMenu
            v-model="state.tags"
            placeholder="select tag"
            multiple
            :options="tags"
          >
            <template #option="{ option: tag }">
              <span
                class="h-2 w-2 rounded-full"
                :class="`bg-${tag.color}-500 dark:bg-${tag.color}-400`"
              />
              <span class="truncate">{{ tag.name }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>

        <UButton
          type="submit"
          color="black"
          variant="solid"
          label="save"
          :loading="isLoading"
        />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { types } from '~/constants'

const accountsStore = useAccountsStore()
const tagsStore = useTagsStore()

const props = defineProps({
  modelValue: Boolean,
  transaction: {
    type: Object as () => Transaction,
    required: false,
    default: () => {}
  }
})

const accounts = accountsStore.getAccounts
const tags: Tag[] = tagsStore.getTags

const isEditing = computed(() => !!props.transaction)
const emit = defineEmits(['update:modelValue', 'saved'])

const schema = z.object({
  type: z.enum(['income', 'expense']),
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive('amount needs to be greater than 0'),
  account: z.enum(accounts as [string, ...[string]]),
  tag: z
    .array(
      z.object({
        name: z.string(),
        color: z.string()
      })
    )
    .optional()
})

const form = ref()
const isLoading = ref(false)
const supabase = useSupabaseClient()
const { toastSuccess, toastError } = useAppToast()

const save = async () => {
  if (form.value.errors.length) {
    return
  }

  isLoading.value = true
  try {
    const { error } = await supabase.from('transactions').upsert({
      ...state.value,
      tags: useTagsToJson(state.value.tags),
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
    throw error
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
      tags: props.transaction.tags
    }
  : {
      type: undefined,
      account: undefined,
      amount: 0,
      created_at: undefined,
      description: undefined,
      tags: [] as Tag[]
    }

const state = ref({ ...initialState })

const resetForm = () => {
  Object.assign(state.value, initialState)
  form.value.clear()
}
const isOpen = computed({
  get: () => props.modelValue,
  set: value => {
    if (!value) {
      resetForm()
    }
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
}
</script>
