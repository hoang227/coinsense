<template>
  <UForm :state="state" :schema="schema" @submit="saveProfile">
    <UFormGroup class="mb-4" label="Username" name="username">
      <UInput v-model="state.username" placeholder="Set new username" />
    </UFormGroup>

    <UFormGroup
      class="mb-4"
      label="Email"
      name="email"
      help="You will receive a confirmation email on both the old and the new email addresses if you modify the email address"
    >
      <UInput v-model="state.email" />
    </UFormGroup>

    <UButton
      :ui="customButton"
      :disabled="pending"
      :pending="pending"
      color="emerald"
      label="Save"
      type="submit"
      variant="solid"
    />
  </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { toastSuccess, toastError } = useAppToast()
const pending = ref(false)

const state = ref({
  username: user.value?.user_metadata?.username,
  email: user.value?.email
})

const schema = z.object({
  username: z.string().min(2).optional(),
  email: z.string().email()
})

const saveProfile = async () => {
  pending.value = true

  try {
    const userData = {
      data: {
        username: state.value.username
      }
    } as UserData

    if (state.value.email !== user.value?.email) {
      if (state.value.email) {
        userData.email = state.value.email
      }
    }

    const { error } = await supabase.auth.updateUser(userData)
    if (error) {
      throw error
    }

    toastSuccess({
      title: 'profile updated',
      description: 'your profile has been updated!'
    })
  } catch (error) {
    toastError({
      title: 'error updating profile',
      description: (error as Error).message
    })
  } finally {
    pending.value = false
  }
}

const customButton = {
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
