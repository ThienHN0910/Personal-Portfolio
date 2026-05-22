<template>
  <div class="section admin-shell min-h-screen py-8">
    <div class="container">
      <AdminSectionHeader kicker="Content Taxonomy" title-before="Manage " title-highlight="Categories">
        <template #actions>
          <button class="btn btn--primary inline-flex items-center gap-2" :disabled="categoriesStore.loading" @click="handleSave">
            <IconGlyph name="edit" :size="14" />
            Save Categories
          </button>
        </template>
      </AdminSectionHeader>

      <LoadingSpinner v-if="loading" />

      <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div class="admin-panel p-6 space-y-5">
          <div>
            <p class="admin-kicker mb-2">Projects</p>
            <h2 class="text-xl font-semibold text-white">Project Categories</h2>
            <p class="text-sm text-gray-500 mt-1">Used on project forms and public project filters.</p>
          </div>

          <StringListEditor
            v-model="projectCategories"
            label="Project categories"
            placeholder="AI, E-commerce, Management System"
            description="Keep labels short and in English."
          />
        </div>

        <div class="admin-panel p-6 space-y-5">
          <div>
            <p class="admin-kicker mb-2">Blog</p>
            <h2 class="text-xl font-semibold text-white">Blog Categories</h2>
            <p class="text-sm text-gray-500 mt-1">Used on blog posts and public blog filters.</p>
          </div>

          <StringListEditor
            v-model="blogCategories"
            label="Blog categories"
            placeholder="Dev Log, Overview, Interview Test"
            description="Keep labels short and in English."
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import AdminSectionHeader from '@/components/admin/AdminSectionHeader.vue'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import StringListEditor from '@/components/admin/StringListEditor.vue'
import { useCategoriesStore } from '@/stores/categories'

const categoriesStore = useCategoriesStore()
const loading = ref(true)

const projectCategories = computed({
  get: () => categoriesStore.categorySettings.projectCategories,
  set: (value: string[]) => {
    categoriesStore.categorySettings.projectCategories = value
  },
})

const blogCategories = computed({
  get: () => categoriesStore.categorySettings.blogCategories,
  set: (value: string[]) => {
    categoriesStore.categorySettings.blogCategories = value
  },
})

async function handleSave(): Promise<void> {
  await categoriesStore.updateCategories({
    projectCategories: projectCategories.value,
    blogCategories: blogCategories.value,
  })
}

onMounted(async () => {
  await categoriesStore.fetchCategories()
  loading.value = false
})
</script>
