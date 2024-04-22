<template>
  <div>
    <div v-if="success">
      logging you in
    </div>
    <UTabs v-else :items="items" class="w-full">
      <template #signin="{ item }">
        <UForm ref="signinForm" :state="signinState" :schema="signinSchema" @submit="handleSignIn">
          <UCard>
            <template #header>
              {{ item.label }} now !
            </template>

            <div class="space-y-3">
              <UFormGroup label="email" name="email">
                <UInput v-model="signinState.email" placeholder="email@example.com" />
              </UFormGroup>
              <UFormGroup label="password" name="password">
                <UInput v-model="signinState.password" type="password" placeholder="password" />
              </UFormGroup>
            </div>

            <template #footer>
              <UButton type="submit" color="black" :loading="isLoading">
                {{ item.label }}
              </UButton>
            </template>
          </UCard>
        </UForm>
      </template>

      <template #signup="{ item }">
        <UForm ref="signupForm" :state="signupState" :schema="signupSchema" @submit="handleSignUp">
          <UCard>
            <template #header>
              {{ item.label }} now !
            </template>

            <div class="space-y-3">
              <UFormGroup label="email" name="email" required>
                <UInput v-model="signupState.email" placeholder="email@example.com" />
              </UFormGroup>
              <UFormGroup label="username" name="username" required>
                <UInput v-model="signupState.username" placeholder="username" />
              </UFormGroup>
              <UFormGroup label="password" name="password" required>
                <UInput
                  v-model="signupState.password"
                  placeholder="password"
                  type="password"
                />
              </UFormGroup>
              <p>
                • password must be at least 8 characters
              </p>
              <p>
                • password must be at most 20 characters
              </p>
              <p>
                • password must contain at least one uppercase letter, one lowercase letter and one digit.
              </p>
            </div>

            <template #footer>
              <UButton type="submit" color="black" :loading="isLoading">
                {{ item.label }}
              </UButton>
            </template>
          </UCard>
        </UForm>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const success = ref(false)
const supabase = useSupabaseClient()
const { toastSuccess, toastError } = useAppToast()
const isLoading = ref(false)
const signinForm = ref()
const signupForm = ref()

const items = [{
  slot: 'signin',
  label: 'sign in'
}, {
  slot: 'signup',
  label: 'sign up'
}]

const signinSchema = z.object({
  email: z.string().email({ message: 'invalid email address' }).optional(),
  password: z.string().optional()
})

const signupSchema = z.object({
  email: z.string().email({ message: 'invalid email address' }),
  username: z.string(),
  password: z.string().min(8, { message: 'password must be at least 8 characters' }).max(20, { message: 'password must be at most 20 characters' }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/, { message: 'password must contain at least one uppercase letter, one lowercase letter and one digit.' })
})

const initialSigninState = {
  email: '',
  password: ''
}

const initialSignupState = {
  email: '',
  username: '',
  password: ''
}

const signinState = ref({ ...initialSigninState })
const signupState = ref({ ...initialSignupState })

const handleSignIn = async () => {
  isLoading.value = true

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: signinState.value.email,
      password: signinState.value.password
    })

    if (!error) {
      toastSuccess({
        title: 'signed in'
      })
      success.value = true
      setTimeout(() => useRedirectIfAuthenticated(), 2000)
    } else {
      throw error
    }
  } catch (error) {
    Object.assign(signinState.value, initialSigninState)
    signinForm.value.clear()
    toastError({
      title: 'failed to sign in',
      description: (error as Error).message
    })
  } finally {
    isLoading.value = false
  }
}

const handleSignUp = async () => {
  isLoading.value = true

  try {
    const { error } = await supabase.auth.signUp({
      email: signupState.value.email,
      password: signupState.value.password,
      options: {
        data: {
          username: signupState.value.username,
          accounts: [] as string[]
        }
      }
    })

    if (!error) {
      toastSuccess({
        title: 'account created'
      })
      await supabase.auth.signInWithPassword({
        email: signupState.value.email,
        password: signupState.value.password
      })
      success.value = true
      setTimeout(() => useRedirectIfAuthenticated(), 2000)
    } else {
      throw error
    }
  } catch (error) {
    Object.assign(signupState.value, initialSignupState)
    signupForm.value.clear()
    toastError({
      title: 'failed to create account',
      description: (error as Error).message
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
p {
  @apply text-xs text-gray-400
}
</style>
