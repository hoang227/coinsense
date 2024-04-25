<template>
  <div>
    <div class="flex items-center justify-between space-x-4">
      <h3>Tags</h3>
      <UButton size="xs" label="add tag" color="black" icon="i-heroicons-plus-circle" @click="isOpen = true" />
      <UModal v-model="isOpen">
        <UCard>
          <template #header>
            New tag
          </template>
          <UForm ref="form" :state="state" :schema="schema" @submit="addTag">
            <UFormGroup label="name" :required="true" name="name" class="mb-4">
              <UInput v-model="state.name" placeholder="tag" />
            </UFormGroup>

            <UFormGroup label="color" :required="true" name="color" class="mb-4">
              <USelect v-model="state.color" placeholder="select color" :options="colors" />
            </UFormGroup>
            <UButton type="submit" color="black" variant="solid" label="save" />
          </UForm>
        </UCard>
      </UModal>
    </div>
    <div class="grid grid-cols-4 gap-x-6">
      <div
        v-for="tag in useTagsStore().getTags"
        :key="tag"
        class="shadow-sm shadow-neutral-400 mt-4 rounded-2xl bg-neutral-200 hover:bg-neutral-400"
        :class="tag.color"
      >
        <div :class="tag.color" class="group flex items-center justify-between col-span-1 rounded-2xl">
          <div class="ml-2 group-hover:text-neutral-100">
            {{ tag.name }}
          </div>
          <UButton
            :ui="customButton"
            :class="`group-hover:bg-${tag.color}-700 hover:bg-${tag.color}-500 text-${tag.color}-500 group-hover:text-neutral-100`"
            class="pr-2"
            color="white"
            icon="i-heroicons-x-mark"
            variant="ghost"
            @click="handleRemoveTag(tag.name)"
          />
        </div>
      </div>
      <UModal v-model="isSure">
        <UCard>
          <div class="mb-4">
            Are you sure you want to delete this tag?
          </div>
          <p class="mb-8">
            All transactions under this tag will be <strong>permanently deleted.</strong>
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
              @click="removeTag()"
            />
          </div>
        </UCard>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const tagStore = useTagsStore()

const isOpen = ref(false)
const isSure = ref(false)

const customButton = {
  rounded: 'rounded-2xl'
}

const colors : string[] = ['red', 'green', 'blue', 'yellow', 'pink', 'purple', 'orange']

const state = ref({
  name: '',
  color: ''
})

const tagToRemove = ref('')

const schema = z.object({
  name: z.string().min(3, { message: 'Tag name must be at least 3 characters' }),
  color: z.enum(colors as [string, ... [string]])
})

const handleRemoveTag = (tag : string) => {
  isSure.value = true
  tagToRemove.value = tag
}

const removeTag = async () => {
  try {
    await tagStore.removeTag(tagToRemove.value)
  } finally {
    isSure.value = false
    tagToRemove.value = ''
  }
}

const addTag = async () => {
  isOpen.value = true
  try {
    await tagStore.addTag(state.value)
  } finally {
    isOpen.value = false
    state.value = {
      name: '',
      color: ''
    }
  }
}
</script>

<style scoped>

.red {
  @apply bg-red-500 hover:bg-red-700 text-neutral-100
}

.green {
  @apply bg-green-500 hover:bg-green-700 text-neutral-100
}

.blue {
  @apply bg-blue-500 hover:bg-blue-700 text-neutral-100
}

.yellow {
  @apply bg-yellow-500 hover:bg-yellow-700 text-neutral-100
}

.pink {
  @apply bg-pink-500 hover:bg-pink-700 text-neutral-100
}

.purple {
  @apply bg-purple-500 hover:bg-purple-700 text-neutral-100
}

.orange {
  @apply bg-orange-500 hover:bg-orange-700 text-neutral-100
}

</style>
