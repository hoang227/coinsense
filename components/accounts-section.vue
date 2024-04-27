<template>
  <div>
    <div class="flex items-center justify-between space-x-4">
      <h3>Accounts</h3>
      <UButton
        size="xs"
        label="add account"
        color="black"
        icon="i-heroicons-plus-circle"
        @click="isOpen = true"
      />
      <UModal v-model="isOpen">
        <UCard>
          <template #header> New account </template>
          <UForm
            ref="form"
            :state="state"
            :schema="schema"
            @submit="addAccount"
          >
            <UFormGroup
              label="name"
              :required="true"
              name="newAccount"
              class="mb-4"
            >
              <UInput v-model="state.newAccount" placeholder="account" />
            </UFormGroup>

            <UButton type="submit" color="black" variant="solid" label="save" />
          </UForm>
        </UCard>
      </UModal>
    </div>
    <div class="grid grid-cols-2 gap-x-8">
      <div
        v-for="account in useAccountsStore().getAccounts"
        :key="account"
        class="mt-4 rounded-lg bg-neutral-200 hover:bg-neutral-400"
      >
        <div class="group col-span-1 flex items-center justify-between">
          <div class="pl-2">
            {{ account }}
          </div>
          <UButton
            :ui="customButton"
            class="pr-2 text-neutral-200 hover:bg-neutral-400 group-hover:text-neutral-800"
            color="white"
            icon="i-heroicons-x-mark"
            variant="ghost"
            @click="handleRemoveAccount(account)"
          />
        </div>
      </div>
      <UModal v-model="isSure">
        <UCard>
          <div class="mb-4">Are you sure you want to delete this account?</div>
          <p class="mb-8">
            All transactions under this account will be
            <strong>permanently deleted.</strong>
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

const customButton = {
  rounded: 'rounded-lg'
}

const state = ref({
  newAccount: ''
})

const accountToRemove = ref('')

const schema = z.object({
  newAccount: z
    .string()
    .min(3, { message: 'account name must be at least 3 characters' })
})

const handleRemoveAccount = (account: string) => {
  isSure.value = true
  accountToRemove.value = account
}

const removeAccount = async () => {
  try {
    await accountStore.removeAccount(accountToRemove.value)
  } finally {
    isSure.value = false
    accountToRemove.value = ''
    navigateTo('/settings/settings')
  }
}

const addAccount = async () => {
  isOpen.value = true
  try {
    await accountStore.addAccount(state.value.newAccount)
  } finally {
    isOpen.value = false
    state.value.newAccount = ''
    navigateTo('/settings/settings')
  }
}
</script>
