<template>
  <div class="section min-h-screen pt-24">
    <div class="container">
      <h1 class="section-title mb-8">Admin <span class="highlight">Dashboard</span></h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div v-for="stat in stats" :key="stat.label" class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="stat.iconBg">
              <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
            </div>
            <span class="text-3xl font-bold text-white">{{ stat.value }}</span>
          </div>
          <p class="text-gray-400 text-sm font-medium">{{ stat.label }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RouterLink
          v-for="link in adminLinks"
          :key="link.to"
          :to="link.to"
          class="card p-6 text-center hover:border-blue-500/30 transition-colors no-underline"
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
import { useProjectsStore } from '@/stores/projects'
import { useBlogStore } from '@/stores/blog'
import { useContactStore } from '@/stores/contact'

const projectsStore = useProjectsStore()
const blogStore = useBlogStore()
const contactStore = useContactStore()

onMounted(() => {
  projectsStore.fetchProjects()
  blogStore.fetchPosts()
  contactStore.fetchMessages()
})

const stats = computed(() => [
  {
    label: 'Total Projects',
    value: projectsStore.projects.length,
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    icon: 'div',
  },
  {
    label: 'Blog Posts',
    value: blogStore.posts.length,
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    icon: 'div',
  },
  {
    label: 'Messages',
    value: contactStore.messages.length,
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    icon: 'div',
  },
  {
    label: 'Featured',
    value: projectsStore.projects.filter((p) => p.featured).length,
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-400',
    icon: 'div',
  },
])

const adminLinks = [
  { to: '/admin/projects', label: 'Manage Projects', description: 'Add, edit, delete projects' },
  { to: '/admin/blog', label: 'Manage Blog', description: 'Write and publish posts' },
  { to: '/admin/messages', label: 'View Messages', description: 'Read contact submissions' },
  { to: '/admin/about', label: 'Edit Content', description: 'Update about & home page' },
]
</script>
