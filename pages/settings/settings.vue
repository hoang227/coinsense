<template>
  <div>
    <div class="flex items-center justify-start space-x-4">
      <h3>accounts</h3>
      <UButton size="xs" label="add account" color="black" icon="i-heroicons-plus-circle" @click="isOpen = true" />
      <UModal v-model="isOpen">
        <UCard>
          <template #header>
            New account
          </template>
          <UForm ref="form" :state="state" :schema="schema" @submit="addAccount">
            <UFormGroup label="name" :required="true" name="newAccount" class="mb-4">
              <UInput v-model="state.newAccount" placeholder="account" />
            </UFormGroup>

            <UButton type="submit" color="black" variant="solid" label="save" />
          </UForm>
        </UCard>
      </UModal>
    </div>
    <div v-for="account in useAccountsStore().getAccounts" :key="account">
      <div class="flex items-center">
        <UBadge color="black" :ui="customBadge">
          {{ account }}
        </UBadge>
        <UButton :ui="customButton" color="white" variant="ghost" icon="i-heroicons-x-mark" @click="removeAccount(account)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const { toastSuccess } = useAppToast()

const accountStore = useAccountsStore()

const isOpen = ref(false)

const customBadge = {
  rounded: 'rounded-full'
}
const customButton = {
  rounded: 'rounded-full'
}

const state = ref({
  newAccount: ''
})

const schema = z.object({
  newAccount: z.string().min(3, { message: 'account name must be at least 3 characters' })
})

const removeAccount = (account: string) => {
  accountStore.removeAccount(account)
  toastSuccess({
    title: 'Account removed'
  })
}

const addAccount = () => {
  accountStore.addAccount(state.value.newAccount)
  isOpen.value = false
  state.value.newAccount = ''
  toastSuccess({
    title: 'Account added'
  })
}

</script>
