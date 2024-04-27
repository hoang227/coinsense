<template>
  <div>
    <div class="mb-4 flex items-center justify-between space-x-4">
      <h3>Tags</h3>
      <UButton
        :ui="customButtonAdd"
        size="xs"
        label="add tag"
        color="emerald"
        icon="i-heroicons-plus-circle"
        @click="isOpen = true"
      />
      <UModal v-model="isOpen">
        <UCard>
          <template #header> New tag </template>
          <UForm ref="form" :state="state" :schema="schema" @submit="addTag">
            <UFormGroup label="Name" :required="true" name="name" class="mb-4">
              <UInput v-model="state.name" placeholder="tag" />
            </UFormGroup>

            <UFormGroup
              label="color"
              :required="true"
              name="Color"
              class="mb-4"
            >
              <USelectMenu
                v-model="state.color"
                :options="colors"
                placeholder="Select a color"
              >
                <template #option="{ option: color }">
                  <span class="h-2 w-2 rounded-full" :class="color" />
                  <span class="truncate">{{ color }}</span>
                </template>
              </USelectMenu>
            </UFormGroup>
            <UButton
              :ui="customButtonAdd"
              type="submit"
              color="emerald"
              variant="solid"
              label="save"
            />
          </UForm>
        </UCard>
      </UModal>
    </div>
    <div class="grid grid-cols-4 gap-x-6">
      <div
        v-for="tag in useTagsStore().getTags"
        :key="`${tag.name as string}`"
        :class="tag.color.toLowerCase()"
        class="group col-span-1 mt-4 flex items-center justify-between rounded-2xl text-sm text-neutral-100"
      >
        <div class="ml-2">
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
  'cashew',
  'brass',
  'redwood',
  'leather',
  'apricot',
  'camel',
  'ocean',
  'night'
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
