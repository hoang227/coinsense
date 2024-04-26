<template>
  <div>
    <div class="flex items-center justify-between space-x-4">
      <h3>Tags</h3>
      <UButton
        size="xs"
        label="add tag"
        color="black"
        icon="i-heroicons-plus-circle"
        @click="isOpen = true"
      />
      <UModal v-model="isOpen">
        <UCard>
          <template #header> New tag </template>
          <UForm ref="form" :state="state" :schema="schema" @submit="addTag">
            <UFormGroup label="name" :required="true" name="name" class="mb-4">
              <UInput v-model="state.name" placeholder="tag" />
            </UFormGroup>

            <UFormGroup
              label="color"
              :required="true"
              name="color"
              class="mb-4"
            >
              <USelect
                v-model="state.color"
                placeholder="select color"
                :options="colors"
              />
            </UFormGroup>
            <UButton type="submit" color="black" variant="solid" label="save" />
          </UForm>
        </UCard>
      </UModal>
    </div>
    <div class="grid grid-cols-4 gap-x-6">
      <div
        v-for="tag in useTagsStore().getTags"
        :key="`${tag.name as string}`"
        :class="tag.color.toLowerCase()"
        class="mt-4 rounded-2xl shadow-sm shadow-neutral-400"
      >
        <div
          class="group col-span-1 flex items-center justify-between rounded-2xl text-neutral-100"
        >
          <div class="ml-2 group-hover:text-neutral-100">
            {{ tag.name }}
          </div>
          <UButton
            :ui="customButton"
            class="pr-2 text-white"
            color="black"
            icon="i-heroicons-x-mark"
            variant="link"
            @click="handleRemoveTag(tag.name)"
          />
        </div>
      </div>
      <UModal v-model="isSure">
        <UCard>
          <div class="mb-4">Are you sure you want to delete this tag?</div>
          <p class="mb-8">
            All transactions under this tag will be
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

const colors: string[] = [
  'Red',
  'Orange',
  'Yellow',
  'Green',
  'Blue',
  'Purple',
  'Pink',
  'Gray'
]

const state = ref({
  name: '',
  color: ''
})

const tagToRemove = ref('')

const schema = z.object({
  name: z
    .string()
    .min(3, { message: 'Tag name must be at least 3 characters' }),
  color: z.enum(colors as [string, ...[string]])
})

const handleRemoveTag = (tag: string) => {
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
  @apply bg-tagRed-light hover:bg-tagRed-dark;
}

.green {
  @apply bg-tagGreen-light hover:bg-tagGreen-dark;
}

.blue {
  @apply bg-tagBlue-light hover:bg-tagBlue-dark;
}

.yellow {
  @apply bg-tagYellow-light hover:bg-tagYellow-dark;
}

.pink {
  @apply bg-tagPink-light hover:bg-tagPink-dark;
}

.purple {
  @apply bg-tagPurple-light hover:bg-tagPurple-dark;
}

.orange {
  @apply bg-tagOrange-light hover:bg-tagOrange-dark;
}
</style>
