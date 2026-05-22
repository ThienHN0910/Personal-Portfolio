<template>
  <div class="section admin-shell min-h-screen py-8">
    <div class="container">
      <AdminSectionHeader kicker="Mission Control" title-before="Admin " title-highlight="Dashboard" />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div v-for="stat in stats" :key="stat.label" class="admin-panel p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="stat.iconBg">
              <IconGlyph :name="stat.iconName" :size="24" class="w-6 h-6" :class="stat.iconColor" />
            </div>
            <span class="text-3xl font-bold text-white">{{ stat.value }}</span>
          </div>
          <p class="text-gray-400 text-sm font-medium">{{ stat.label }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <RouterLink
          v-for="link in adminLinks"
          :key="link.to"
          :to="link.to"
          class="admin-panel p-6 text-center hover:border-blue-500/30 transition-colors no-underline"
        >
          <p class="text-blue-400 font-semibold mb-1">{{ link.label }}</p>
          <p class="text-gray-500 text-sm">{{ link.description }}</p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import AdminSectionHeader from '@/components/admin/AdminSectionHeader.vue'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import { useProjectsStore } from '@/stores/projects'
import { useBlogStore } from '@/stores/blog'
import { useContactStore } from '@/stores/contact'

const statsMeta = [
  {
    label: 'Total Projects',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    iconName: 'projects' as const,
  },
  {
    label: 'Blog Posts',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    iconName: 'blog' as const,
  },
  {
    label: 'Messages',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    iconName: 'messages' as const,
  },
  {
    label: 'Featured',
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-400',
    iconName: 'featured' as const,
  },
]

const projectsStore = useProjectsStore()
const blogStore = useBlogStore()
const contactStore = useContactStore()

onMounted(() => {
  projectsStore.fetchProjects()
  blogStore.fetchPosts(true)
  contactStore.fetchMessages()
})

const stats = computed(() => [
  {
    ...statsMeta[0],
    value: projectsStore.projects.length,
  },
  {
    ...statsMeta[1],
    value: blogStore.posts.length,
  },
  {
    ...statsMeta[2],
    value: contactStore.messages.length,
  },
  {
    ...statsMeta[3],
    value: projectsStore.projects.filter((p) => p.featured).length,
  },
])

const adminLinks = [
  { to: '/admin/projects', label: 'Manage Projects', description: 'Add, edit, delete projects' },
  { to: '/admin/blog', label: 'Manage Blog', description: 'Write and publish posts' },
  { to: '/admin/categories', label: 'Categories', description: 'Organize project and blog categories' },
  { to: '/admin/messages', label: 'View Messages', description: 'Read contact submissions' },
  { to: '/admin/about', label: 'Edit Content', description: 'Update about & home page' },
  { to: '/admin/appearance', label: 'Appearance', description: 'Theme gradients and colors' },
]
</script>
