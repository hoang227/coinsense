<template>
  <div>
    <UFormGroup label="current avatar" class="w-full mb-4">
      <img :src="url" class="size-40 object-cover rounded-full mt-6"></img>
      <img :src="url" class="size-40 object-cover rounded-full mt-6"></img>
    </UFormGroup>

    <UFormGroup label="new avatar" class="w-full mb-4" name="avatar" help="choose an image">
      <UInput ref="fileInput" type="file" />
    </UFormGroup>

    <UButton
      :disabled="uploading"
      :loading="uploading"
      class="mr-2"
      color="black"
      label="save"
      type="submit"
      variant="solid"
      @click="saveAvatar"
    />
    <UButton
      :disabled="deleting"
      :loading="deleting"
      color="red"
      label="delete"
      type="submit"
      variant="solid"
      @click="deleteAvatar"
    />
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { toastSuccess, toastError } = useAppToast()
const { url }: { url: Ref<string | undefined> } = useAvatarUrl()

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

    const currentAvatarUrl : string = user.value?.user_metadata?.avatar_url

    const { error } = await supabase
      .storage
      .from('avatars')
      .upload(fileName, file)

    if (error) { throw error }

    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName
      }
    })

    // remove old avatar from database
    if (currentAvatarUrl) {
      const { error } = await supabase
        .storage
        .from('avatars')
        .remove([currentAvatarUrl])
      if (error) { throw error }
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
    const currentAvatarUrl : string = user.value?.user_metadata?.avatar_url

    console.log(currentAvatarUrl)

    await supabase.auth.updateUser({
      data: {
        avatar_url: null
      }
    })

    // remove old avatar from database
    if (currentAvatarUrl) {
      const { error } = await supabase
        .storage
        .from('avatars')
        .remove([currentAvatarUrl])
      if (error) { throw error }
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
</script>
