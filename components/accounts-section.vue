<template>
  <div>
    <div class="mb-4 flex items-center justify-between space-x-4">
      <h3>Accounts</h3>
      <UButton
        :ui="customButtonAdd"
        size="xs"
        label="add account"
        color="emerald"
        icon="i-heroicons-plus-circle"
        @click="isOpen = true"
      />
      <UModal v-model="isOpen">
        <UCard>
          <template #header>New account </template>
          <UForm
            ref="form"
            :state="state"
            :schema="schema"
            @submit="addAccount"
          >
            <UFormGroup
              label="Name"
              :required="true"
              name="newAccount"
              class="mb-4"
            >
              <UInput v-model="state.newAccount" placeholder="Account" />
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
        class="mt-4 rounded-lg bg-gray-200 text-sm hover:bg-gray-400"
      >
        <div class="group col-span-1 flex items-center justify-between">
          <div class="pl-2 dark:text-gray-800">
            {{ account }}
          </div>
          <UButton
            :ui="customButton"
            class="pr-2 text-gray-200 hover:bg-gray-400 group-hover:text-gray-800 dark:text-gray-800 dark:hover:bg-gray-400 dark:group-hover:text-gray-800"
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

const customButtonAdd = {
  color: {
    emerald: {
      solid:
        'ring-1 ring-inset ring-emerald-600 dark:ring-emerald-500 text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-white dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:disabled:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-500'
    },
    redwood: {
      solid:
        'ring-1 ring-inset ring-tagRedwood-light text-white bg-tagRedwood-light hover:bg-tagRedwood-dark disabled:bg-white dark:bg-tagRedwood-dark dark:hover:bg-tagRedwood-light dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-tagRedwood-dark dark:focus-visible:ring-tagRedwood-light'
    }
  }
}
</script>
