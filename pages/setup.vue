<template>
  <div>
    <div class="flex flex-col items-center justify-center space-y-8">
      <div class="flex items-center justify-center space-x-4">
        <h3>Add your first account</h3>
        <UButton
          v-if="!addedAccount"
          :ui="customButton"
          size="xs"
          color="emerald"
          icon="i-heroicons-plus-circle"
          @click="isOpen = true"
        />
        <UIcon
          v-else
          name="i-heroicons-check"
          class="text-3xl text-emerald-500"
        />
      </div>
      <UBadge
        v-if="addedAccount"
        :ui="customBadge"
        size="lg"
        color="redwood"
        class="mt-4"
      >
        {{ state.newAccount }}
      </UBadge>
      <UButton
        v-if="addedAccount"
        :ui="customButton"
        size="md"
        label="start !"
        color="emerald"
        trailing
        @click="handleStart"
      />
    </div>
    <UModal v-model="isOpen">
      <UCard>
        <template #header>First account </template>
        <UForm ref="form" :state="state" :schema="schema" @submit="addAccount">
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
</template>

<script setup lang="ts">
import { z } from 'zod'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

definePageMeta({
  layout: 'setup'
})

const accountStore = useAccountsStore()
const isOpen = ref(false)
const addedAccount = ref(false)

const state = ref({
  newAccount: ''
})

const schema = z.object({
  newAccount: z
    .string()
    .min(3, { message: 'account name must be at least 3 characters' })
})

const addAccount = async () => {
  isOpen.value = true
  try {
    await accountStore.addAccount(state.value.newAccount)
  } finally {
    isOpen.value = false
    addedAccount.value = true
    navigateTo('/setup')
  }
}

const handleStart = async () => {
  await supabase.auth.updateUser({
    data: {
      set_up_complete: true
    }
  })
  useRedirectIfAuthenticated()
}

const customButton = {
  color: {
    emerald: {
      solid:
        'ring-1 ring-inset ring-emerald-600 dark:ring-emerald-500 text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-white dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:disabled:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-500'
    }
  }
}

const customBadge = {
  rounded: 'rounded-full',
  color: {
    emerald: {
      solid:
        'ring-1 ring-inset ring-emerald-600 dark:ring-emerald-500 text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-white dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:disabled:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-500'
    },
    redwood: {
      solid:
        'ring-1 ring-inset ring-tagRedwood-light text-white bg-tagRedwood-light disabled:bg-white dark:bg-tagRedwood-dark dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-tagRedwood-dark dark:focus-visible:ring-tagRedwood-light'
    }
  }
}
</script>
