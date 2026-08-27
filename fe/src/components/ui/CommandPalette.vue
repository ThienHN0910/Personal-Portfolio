<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9990] flex items-start justify-center pt-14 sm:pt-20 px-4 sm:px-6 bg-slate-950/80 backdrop-blur-md"
        @click.self="handleClose"
        @keydown.esc.prevent="handleClose"
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
      >
        <!-- Modal Card -->
        <div
          class="relative w-full max-w-2xl bg-slate-900/95 border border-cyber-border/40 rounded-2xl shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden flex flex-col max-h-[78vh] animate-in fade-in zoom-in-95 duration-200 shadow-inner-glow"
        >
          <!-- Top Search Header -->
          <div class="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-slate-950/70">
            <span class="text-cyan-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>

            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              class="w-full bg-transparent text-slate-100 placeholder-slate-400 font-mono text-sm focus:outline-none"
              placeholder="Type to search pages, projects, articles, or actions..."
              autocomplete="off"
              spellcheck="false"
              @keydown.down.prevent="navigateDown"
              @keydown.up.prevent="navigateUp"
              @keydown.enter.prevent="executeSelected"
              @keydown.esc="handleClose"
            />

            <!-- Clear / Close Button -->
            <button
              v-if="searchQuery"
              type="button"
              class="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              @click="searchQuery = ''"
              aria-label="Clear search"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <span class="hidden sm:inline-block px-2 py-0.5 rounded border border-white/15 bg-white/5 font-mono text-[10px] text-slate-400">
              ESC
            </span>
          </div>

          <!-- Results Scroll Area -->
          <div
            ref="resultsContainerRef"
            class="overflow-y-auto p-2 sm:p-3 space-y-4 max-h-[60vh] custom-scrollbar focus:outline-none"
            tabindex="-1"
          >
            <!-- Empty State -->
            <div
              v-if="flatItems.length === 0"
              class="py-12 px-4 text-center flex flex-col items-center justify-center space-y-3"
            >
              <div class="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-slate-300 font-medium text-sm">No results found for "<span class="text-cyber-cyan">{{ searchQuery }}</span>"</p>
              <p class="text-slate-400 text-xs font-mono">Try searching with a different keyword, technology, or page name.</p>
            </div>

            <!-- Grouped Sections -->
            <div v-for="group in groupedItems" :key="group.category" class="space-y-1.5">
              <!-- Group Header -->
              <div class="flex items-center justify-between px-3 py-1 font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span class="flex items-center gap-1.5">
                  <span class="text-cyber-cyan">#</span>
                  {{ group.title }}
                </span>
                <span v-if="group.category === 'recent'" class="text-[10px] text-slate-400 hover:text-rose-400 cursor-pointer font-sans" @click.stop="clearRecentSearches">
                  Clear History
                </span>
                <span v-else class="text-[10px] text-slate-400 font-sans">
                  {{ group.items.length }} {{ group.items.length === 1 ? 'item' : 'items' }}
                </span>
              </div>

              <!-- Group Items -->
              <div
                v-for="item in group.items"
                :key="item.id"
                :data-item-id="item.id"
                class="group relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer"
                :class="[
                  flatItems[selectedIndex]?.id === item.id
                    ? 'bg-cyan-400/10 border-cyan-400/50 text-white shadow-[0_0_15px_rgba(0,229,255,0.15)] pl-3.5'
                    : 'border-white/5 hover:border-white/20 hover:bg-white/5 text-slate-300'
                ]"
                @click="selectItem(item)"
                @mouseenter="hoverItem(item)"
              >
                <!-- Item Left: Icon & Text -->
                <div class="flex items-center gap-3 min-w-0">
                  <!-- Category Icon -->
                  <div
                    class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-inner-glow"
                    :class="[
                      flatItems[selectedIndex]?.id === item.id
                        ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                        : 'bg-white/5 text-slate-400 group-hover:text-white border border-white/10'
                    ]"
                  >
                    <!-- Icon Switcher -->
                    <svg v-if="item.category === 'page'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <svg v-else-if="item.category === 'project'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <svg v-else-if="item.category === 'article'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 6.75H8.25a2.25 2.25 0 00-2.25 2.25v11.25A2.25 2.25 0 008.25 22.5H19.5a2.25 2.25 0 002.25-2.25V9a2.25 2.25 0 00-2.25-2.25Z" />
                    </svg>
                    <svg v-else-if="item.category === 'action'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <!-- Labels -->
                  <div class="flex flex-col min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-sm truncate font-sans text-slate-100">
                        {{ item.title }}
                      </span>
                      <span
                        v-if="item.badge"
                        class="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border"
                        :class="[
                          flatItems[selectedIndex]?.id === item.id
                            ? 'bg-cyber-cyan/20 border-cyber-cyan/40 text-cyber-cyan'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        ]"
                      >
                        {{ item.badge }}
                      </span>
                    </div>

                    <span v-if="item.subtitle" class="text-xs text-slate-400 truncate mt-0.5">
                      {{ item.subtitle }}
                    </span>
                  </div>
                </div>

                <!-- Item Right: Shortcut or Enter indicator -->
                <div class="flex items-center gap-2 shrink-0">
                  <span
                    v-if="flatItems[selectedIndex]?.id === item.id"
                    class="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-cyber-cyan px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30"
                  >
                    <span>Execute</span>
                    <span>↵</span>
                  </span>
                  <span v-else-if="item.shortcut" class="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                    {{ item.shortcut }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Footer Info -->
          <div class="px-4 py-2.5 bg-slate-950/80 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-slate-400">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-slate-300">↑↓</kbd>
                <span>Navigate</span>
              </span>
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-slate-300">↵</kbd>
                <span>Select</span>
              </span>
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-slate-300">ESC</kbd>
                <span>Close</span>
              </span>
            </div>

            <span class="text-cyber-cyan font-bold">
              {{ flatItems.length }} result{{ flatItems.length === 1 ? '' : 's' }}
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCommandPalette } from '@/composables/useCommandPalette'
import { useToast } from '@/composables/useToast'
import { useProjectsStore } from '@/stores/projects'
import { useBlogStore } from '@/stores/blog'
import { useAboutStore } from '@/stores/about'

export interface CommandItem {
  id: string
  title: string
  subtitle?: string
  category: 'recent' | 'page' | 'project' | 'article' | 'action'
  badge?: string
  shortcut?: string
  perform: () => void | Promise<void>
}

interface GroupedCategory {
  category: string
  title: string
  items: CommandItem[]
}

const { isOpen, closePalette } = useCommandPalette()
const { showToast } = useToast()
const router = useRouter()

const projectsStore = useProjectsStore()
const blogStore = useBlogStore()
const aboutStore = useAboutStore()

const searchQuery = ref('')
const selectedIndex = ref(0)
const searchInputRef = ref<HTMLInputElement | null>(null)
const resultsContainerRef = ref<HTMLDivElement | null>(null)

// Recent searches
const RECENT_KEY = 'portfolio_cmd_recent_searches'
const recentSearches = ref<Array<{ query: string; timestamp: number }>>([])

function loadRecentSearches() {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    if (raw) {
      recentSearches.value = JSON.parse(raw)
    }
  } catch {
    recentSearches.value = []
  }
}

function saveRecentSearch(query: string) {
  const trimmed = query.trim()
  if (!trimmed || trimmed.length < 2) return

  const filtered = recentSearches.value.filter((r) => r.query.toLowerCase() !== trimmed.toLowerCase())
  filtered.unshift({ query: trimmed, timestamp: Date.now() })
  recentSearches.value = filtered.slice(0, 5)

  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentSearches.value))
  } catch {
    // Ignore storage errors
  }
}

function clearRecentSearches() {
  recentSearches.value = []
  try {
    localStorage.removeItem(RECENT_KEY)
  } catch {
    // Ignore storage errors
  }
  showToast('Search history cleared', 'info')
}

// Ensure stores are populated
async function ensureDataLoaded() {
  const promises: Promise<any>[] = []
  if (!projectsStore.projects.length) promises.push(projectsStore.fetchProjects())
  if (!blogStore.posts.length) promises.push(blogStore.fetchPosts())
  if (!aboutStore.aboutData) promises.push(aboutStore.fetchAboutData())
  if (promises.length) {
    await Promise.allSettled(promises)
  }
}

watch(isOpen, async (val) => {
  if (val) {
    searchQuery.value = ''
    selectedIndex.value = 0
    loadRecentSearches()
    void ensureDataLoaded()
    await nextTick()
    searchInputRef.value?.focus()
  }
})

// Static navigation pages
const staticPages: CommandItem[] = [
  {
    id: 'page-home',
    title: 'Home',
    subtitle: 'Selected projects, technical profile, and latest updates',
    category: 'page',
    badge: 'Page',
    perform: () => {
      void router.push('/')
    },
  },
  {
    id: 'page-about',
    title: 'About Me',
    subtitle: 'Career timeline, technical skills, education & certifications',
    category: 'page',
    badge: 'Page',
    perform: () => {
      void router.push('/about')
    },
  },
  {
    id: 'page-projects',
    title: 'Engineering Projects',
    subtitle: 'Portfolio of full-stack web applications and architectures',
    category: 'page',
    badge: 'Page',
    perform: () => {
      void router.push('/projects')
    },
  },
  {
    id: 'page-blog',
    title: 'Articles & Blog',
    subtitle: 'Technical writings on web development and software engineering',
    category: 'page',
    badge: 'Page',
    perform: () => {
      void router.push('/blog')
    },
  },
  {
    id: 'page-cv',
    title: 'Curriculum Vitae (CV)',
    subtitle: 'Interactive PDF viewer and downloadable resume',
    category: 'page',
    badge: 'Page',
    perform: () => {
      void router.push('/cv')
    },
  },
  {
    id: 'page-contact',
    title: 'Contact & Inquiries',
    subtitle: 'Send message for project collaboration or technical roles',
    category: 'page',
    badge: 'Page',
    perform: () => {
      void router.push('/contact')
    },
  },
  {
    id: 'page-privacy',
    title: 'Privacy Policy',
    subtitle: 'Data usage and privacy policy terms',
    category: 'page',
    badge: 'Page',
    perform: () => {
      void router.push('/privacy')
    },
  },
  {
    id: 'page-admin',
    title: 'Admin CMS Gate',
    subtitle: 'Manage dashboard, content, analytics, and appearances',
    category: 'page',
    badge: 'Admin',
    perform: () => {
      void router.push('/admin')
    },
  },
]

// Quick actions
const quickActions = computed<CommandItem[]>(() => {
  const email = aboutStore.aboutData?.contactInfo?.email || 'thienhn0910@gmail.com'
  const resumeUrl = aboutStore.aboutData?.resumeUrl

  return [
    {
      id: 'action-copy-email',
      title: 'Copy Email Address',
      subtitle: email,
      category: 'action',
      badge: 'Action',
      perform: async () => {
        try {
          await navigator.clipboard.writeText(email)
          showToast(`Copied ${email} to clipboard!`, 'success')
        } catch {
          showToast('Failed to copy email to clipboard', 'error')
        }
      },
    },
    {
      id: 'action-copy-link',
      title: 'Copy Current Page Link',
      subtitle: typeof window !== 'undefined' ? window.location.href : '',
      category: 'action',
      badge: 'Action',
      perform: async () => {
        try {
          await navigator.clipboard.writeText(window.location.href)
          showToast('Current link copied to clipboard!', 'success')
        } catch {
          showToast('Failed to copy link to clipboard', 'error')
        }
      },
    },
    {
      id: 'action-download-cv',
      title: 'Download / View Resume (CV)',
      subtitle: resumeUrl ? 'Direct download PDF resume' : 'Open CV interactive viewer',
      category: 'action',
      badge: 'Action',
      perform: () => {
        if (resumeUrl) {
          window.open(resumeUrl, '_blank')
        } else {
          void router.push('/cv')
        }
      },
    },
    {
      id: 'action-github',
      title: 'Open GitHub Profile',
      subtitle: 'https://github.com/ThienHN0910',
      category: 'action',
      badge: 'External',
      perform: () => {
        window.open('https://github.com/ThienHN0910', '_blank')
      },
    },
    {
      id: 'action-linkedin',
      title: 'Open LinkedIn Profile',
      subtitle: 'View professional profile and connections',
      category: 'action',
      badge: 'External',
      perform: () => {
        const link = aboutStore.aboutData?.socialLinks?.find((s) => s.label.toLowerCase().includes('linkedin'))?.url || 'https://linkedin.com'
        window.open(link, '_blank')
      },
    },
  ]
})

// Dynamic project items
const projectItems = computed<CommandItem[]>(() => {
  return projectsStore.projects.map((p) => ({
    id: `project-${p._id || p.slug}`,
    title: p.title,
    subtitle: `${p.technologies?.slice(0, 3).join(', ') || ''} — ${p.description.slice(0, 70)}...`,
    category: 'project' as const,
    badge: p.featured ? 'Featured' : 'Project',
    perform: () => {
      const target = p.slug ? `/projects/${p.slug}` : `/projects/${p._id}`
      void router.push(target)
    },
  }))
})

// Dynamic blog items
const blogItems = computed<CommandItem[]>(() => {
  return blogStore.posts.map((post) => ({
    id: `post-${post._id || post.slug}`,
    title: post.title,
    subtitle: `${post.categories?.join(', ') || 'Tech'} — ${post.excerpt?.slice(0, 70) || ''}...`,
    category: 'article' as const,
    badge: 'Article',
    perform: () => {
      const target = post.slug ? `/blog/${post.slug}` : `/blog/${post._id}`
      void router.push(target)
    },
  }))
})

// Filtered grouped items
const groupedItems = computed<GroupedCategory[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const groups: GroupedCategory[] = []

  // If query is empty, show recent searches (if any), pages, and quick actions
  if (!q) {
    if (recentSearches.value.length > 0) {
      groups.push({
        category: 'recent',
        title: 'Recent Searches',
        items: recentSearches.value.map((r, idx) => ({
          id: `recent-${idx}`,
          title: r.query,
          subtitle: 'Search query',
          category: 'recent',
          badge: 'History',
          perform: () => {
            searchQuery.value = r.query
          },
        })),
      })
    }

    groups.push({
      category: 'page',
      title: 'Navigation',
      items: staticPages,
    })

    groups.push({
      category: 'action',
      title: 'Quick Actions',
      items: quickActions.value,
    })

    if (projectItems.value.length > 0) {
      groups.push({
        category: 'project',
        title: 'Featured Projects',
        items: projectItems.value.slice(0, 4),
      })
    }

    return groups
  }

  // Filter Quick Actions
  const matchedActions = quickActions.value.filter(
    (item) => item.title.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q),
  )
  if (matchedActions.length > 0) {
    groups.push({
      category: 'action',
      title: 'Actions',
      items: matchedActions,
    })
  }

  // Filter Pages
  const matchedPages = staticPages.filter(
    (item) => item.title.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q),
  )
  if (matchedPages.length > 0) {
    groups.push({
      category: 'page',
      title: 'Pages',
      items: matchedPages,
    })
  }

  // Filter Projects
  const matchedProjects = projectItems.value.filter(
    (item) => item.title.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q),
  )
  if (matchedProjects.length > 0) {
    groups.push({
      category: 'project',
      title: 'Projects',
      items: matchedProjects,
    })
  }

  // Filter Articles
  const matchedArticles = blogItems.value.filter(
    (item) => item.title.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q),
  )
  if (matchedArticles.length > 0) {
    groups.push({
      category: 'article',
      title: 'Articles',
      items: matchedArticles,
    })
  }

  return groups
})

// Flattened list for linear arrow navigation
const flatItems = computed<CommandItem[]>(() => {
  return groupedItems.value.flatMap((g) => g.items)
})

// Reset or bound selectedIndex whenever flatItems changes
watch(
  () => flatItems.value.length,
  (len) => {
    if (selectedIndex.value >= len) {
      selectedIndex.value = Math.max(0, len - 1)
    }
  },
)

function scrollActiveItemIntoView() {
  nextTick(() => {
    const activeItem = flatItems.value[selectedIndex.value]
    if (!activeItem || !resultsContainerRef.value) return

    const el = resultsContainerRef.value.querySelector(`[data-item-id="${activeItem.id}"]`)
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  })
}

function navigateDown() {
  if (flatItems.value.length === 0) return
  selectedIndex.value = (selectedIndex.value + 1) % flatItems.value.length
  scrollActiveItemIntoView()
}

function navigateUp() {
  if (flatItems.value.length === 0) return
  selectedIndex.value = (selectedIndex.value - 1 + flatItems.value.length) % flatItems.value.length
  scrollActiveItemIntoView()
}

function hoverItem(item: CommandItem) {
  const idx = flatItems.value.findIndex((i) => i.id === item.id)
  if (idx !== -1) {
    selectedIndex.value = idx
  }
}

async function selectItem(item: CommandItem) {
  if (searchQuery.value) {
    saveRecentSearch(searchQuery.value)
  }

  if (item.category === 'recent') {
    item.perform()
    return
  }

  closePalette()
  await item.perform()
}

function executeSelected() {
  const item = flatItems.value[selectedIndex.value]
  if (item) {
    void selectItem(item)
  }
}

function handleClose() {
  closePalette()
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.6);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 242, 255, 0.2);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 242, 255, 0.4);
}
</style>
