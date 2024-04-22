<template>
  <div>
    <div class="flex items-center justify-between space-x-4">
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
    <div class="grid grid-cols-2">
      <div v-for="account in useAccountsStore().getAccounts" :key="account" class="mt-4">
        <div class="flex items-center col-span-1">
          <UButton :ui="customButton" color="white" variant="ghost" icon="i-heroicons-x-mark" @click="handleRemoveAccount(account)" />
          <UBadge size="md" color="black" :ui="customBadge">
            {{ account }}
          </UBadge>
        </div>
      </div>
      <UModal v-model="isSure">
        <UCard>
          <div class="mb-4">
            Are you sure you want to delete this account?
          </div>
          <p class="mb-8">
            All transactions under this account will be <strong>permanently deleted.</strong>
          </p>
          <div class="flex items-center justify-center space-x-6">
            <UButton
              color="black"
              label="cancel"
              type="submit"
              variant="solid"
              @click="isSure = false"
            />
            <UButton
              color="red"
              label="delete"
              type="submit"
              variant="solid"
              @click="removeAccount()"
            />
          </div>
        </UCard>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const accountStore = useAccountsStore()

const isOpen = ref(false)
const isSure = ref(false)

const customBadge = {
  rounded: 'rounded-full'
}
const customButton = {
  rounded: 'rounded-full'
}

const state = ref({
  newAccount: ''
})

const accountToRemove = ref('')

const schema = z.object({
  newAccount: z.string().min(3, { message: 'account name must be at least 3 characters' })
})

const handleRemoveAccount = (account : string) => {
  isSure.value = true
  accountToRemove.value = account
}

const removeAccount = async () => {
  try {
    await accountStore.removeAccount(accountToRemove.value)
  } finally {
    isSure.value = false
    accountToRemove.value = ''
  }
}

const addAccount = async () => {
  isOpen.value = true
  try {
    await accountStore.addAccount(state.value.newAccount)
  } finally {
    isOpen.value = false
    state.value.newAccount = ''
  }
}

</script>
