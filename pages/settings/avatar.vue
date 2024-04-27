<template>
  <div>
    <UFormGroup label="Current Avatar" class="mb-4 w-full">
      <img
        v-if="url"
        :src="url"
        class="mt-6 size-40 rounded-full object-cover"
      />
      <img
        v-else
        src="/public/img/blank_profile.png"
        class="mt-6 size-40 rounded-full object-cover"
      />
    </UFormGroup>

    <UFormGroup
      label="New Avatar"
      class="mb-4 w-full"
      name="avatar"
      help="Choose an image"
    >
      <UInput ref="fileInput" type="file" />
    </UFormGroup>

    <div class="flex items-center justify-start space-x-2">
      <UButton
        :ui="customButton"
        :disabled="uploading"
        :loading="uploading"
        color="emerald"
        label="Save"
        type="submit"
        variant="solid"
        @click="saveAvatar"
      />
      <UButton
        :ui="customButton"
        :disabled="deleting"
        :loading="deleting"
        color="redwood"
        label="Delete"
        type="submit"
        variant="solid"
        @click="deleteAvatar"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { url }: { url: Ref<string | undefined> } = useAvatarUrl()
const { toastSuccess, toastError } = useAppToast()

const uploading = ref(false)
const deleting = ref(false)
const fileInput = ref()

const saveAvatar = async () => {
  const file = fileInput.value.input.files[0]

  if (!file) {
    toastError({
      title: 'select an avatar to upload first'
    })
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`

  try {
    uploading.value = true

    const currentAvatarUrl: string = user.value?.user_metadata?.avatar_url

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file)

    if (error) {
      throw error
    }

    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName
      }
    })

    // remove old avatar from database
    if (currentAvatarUrl) {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([currentAvatarUrl])
      if (error) {
        throw error
      }
    }

    fileInput.value.input.value = null

    toastSuccess({
      title: 'avatar updated'
    })
  } catch (error) {
    toastError({
      title: 'error uploading avatar',
      description: (error as Error).message
    })
  } finally {
    uploading.value = false
  }
}

const deleteAvatar = async () => {
  try {
    deleting.value = true
    const currentAvatarUrl: string = user.value?.user_metadata?.avatar_url

    if (!currentAvatarUrl) {
      throw new Error('no avatar chosen')
    }

    await supabase.auth.updateUser({
      data: {
        avatar_url: null
      }
    })

    // remove old avatar from database
    if (currentAvatarUrl) {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([currentAvatarUrl])
      if (error) {
        throw error
      }
    }

    fileInput.value.input.value = null

    toastSuccess({
      title: 'avatar deleted'
    })
  } catch (error) {
    toastError({
      title: 'error deleting avatar',
      description: (error as Error).message
    })
  } finally {
    deleting.value = false
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
