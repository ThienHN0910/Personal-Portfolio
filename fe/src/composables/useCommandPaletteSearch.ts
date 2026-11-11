import { ref, computed, unref, type Ref, type ComputedRef } from 'vue'

export interface CommandItem {
  id: string
  title: string
  subtitle?: string
  category: 'recent' | 'page' | 'project' | 'article' | 'action' | 'theme' | 'weather'
  badge?: string
  shortcut?: string
  swatchBg?: string
  swatchBorder?: string
  perform: () => void | Promise<void>
}

export interface GroupedCategory {
  category: string
  title: string
  items: CommandItem[]
}

export interface RecentSearchItem {
  query: string
  timestamp: number
}

export const RECENT_KEY = 'portfolio_cmd_recent_searches'

export const THEME_KEYWORDS = [
  'theme',
  'palette',
  'color',
  'mode',
  'dark',
  'light',
  'cyber',
  'sepia',
] as const

export const WEATHER_KEYWORDS = [
  'weather',
  'thoi tiet',
  'rain',
  'mua',
  'sun',
  'storm',
  'snow',
  'cloud',
  'ambient',
  'atmosphere',
] as const

export type CommandItemSource = CommandItem[] | Ref<CommandItem[]> | ComputedRef<CommandItem[]>

export interface UseCommandPaletteSearchOptions {
  staticPages?: CommandItemSource
  quickActions?: CommandItemSource
  themeItems?: CommandItemSource
  projectItems?: CommandItemSource
  blogItems?: CommandItemSource
  weatherItems?: CommandItemSource
  storageKey?: string
  maxRecentCount?: number
  onRecentCleared?: () => void
}

function resolveItems(source?: CommandItemSource): CommandItem[] {
  if (!source) return []
  return unref(source) || []
}

export function isThemeKeyword(q: string): boolean {
  return THEME_KEYWORDS.some((kw) => q.includes(kw))
}

export function isWeatherKeyword(q: string): boolean {
  return WEATHER_KEYWORDS.some((kw) => q.includes(kw))
}

export function matchesItemQuery(item: CommandItem, q: string): boolean {
  if (item.title.toLowerCase().includes(q)) return true
  if (item.subtitle && item.subtitle.toLowerCase().includes(q)) return true
  return false
}

export function filterThemeItems(items: CommandItem[], q: string): CommandItem[] {
  const isThemeSearch = isThemeKeyword(q)
  return items.filter((item) => isThemeSearch || matchesItemQuery(item, q))
}

export function filterWeatherItems(items: CommandItem[], q: string): CommandItem[] {
  const isWeatherSearch = isWeatherKeyword(q)
  return items.filter((item) => isWeatherSearch || matchesItemQuery(item, q))
}

export function filterCategoryItems(items: CommandItem[], q: string): CommandItem[] {
  return items.filter((item) => matchesItemQuery(item, q))
}

export function rankAndGroupCommandItems(
  query: string,
  sources: {
    staticPages?: CommandItem[]
    quickActions?: CommandItem[]
    themeItems?: CommandItem[]
    projectItems?: CommandItem[]
    blogItems?: CommandItem[]
    weatherItems?: CommandItem[]
  },
  recentSearches: RecentSearchItem[],
  onSelectRecent: (query: string) => void,
): GroupedCategory[] {
  const q = query.trim().toLowerCase()
  const groups: GroupedCategory[] = []

  const staticPages = sources.staticPages || []
  const quickActions = sources.quickActions || []
  const themeItems = sources.themeItems || []
  const weatherItems = sources.weatherItems || []
  const projectItems = sources.projectItems || []
  const blogItems = sources.blogItems || []

  // If query is empty, show recent searches (if any), pages, and quick actions
  if (!q) {
    if (recentSearches.length > 0) {
      groups.push({
        category: 'recent',
        title: 'Recent Searches',
        items: recentSearches.map((r, idx) => ({
          id: `recent-${idx}`,
          title: r.query,
          subtitle: 'Search query',
          category: 'recent',
          badge: 'History',
          perform: () => {
            onSelectRecent(r.query)
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
      items: quickActions,
    })

    groups.push({
      category: 'theme',
      title: 'Theme & Appearance',
      items: themeItems,
    })

    groups.push({
      category: 'weather',
      title: 'Weather & Atmosphere',
      items: weatherItems,
    })

    if (projectItems.length > 0) {
      groups.push({
        category: 'project',
        title: 'Featured Projects',
        items: projectItems.slice(0, 4),
      })
    }

    return groups
  }

  // Filter Themes
  const matchedThemes = filterThemeItems(themeItems, q)
  if (matchedThemes.length > 0) {
    groups.push({
      category: 'theme',
      title: 'Theme & Appearance',
      items: matchedThemes,
    })
  }

  // Filter Weather
  const matchedWeather = filterWeatherItems(weatherItems, q)
  if (matchedWeather.length > 0) {
    groups.push({
      category: 'weather',
      title: 'Weather & Atmosphere',
      items: matchedWeather,
    })
  }

  // Filter Quick Actions
  const matchedActions = filterCategoryItems(quickActions, q)
  if (matchedActions.length > 0) {
    groups.push({
      category: 'action',
      title: 'Actions',
      items: matchedActions,
    })
  }

  // Filter Pages
  const matchedPages = filterCategoryItems(staticPages, q)
  if (matchedPages.length > 0) {
    groups.push({
      category: 'page',
      title: 'Pages',
      items: matchedPages,
    })
  }

  // Filter Projects
  const matchedProjects = filterCategoryItems(projectItems, q)
  if (matchedProjects.length > 0) {
    groups.push({
      category: 'project',
      title: 'Projects',
      items: matchedProjects,
    })
  }

  // Filter Articles
  const matchedArticles = filterCategoryItems(blogItems, q)
  if (matchedArticles.length > 0) {
    groups.push({
      category: 'article',
      title: 'Articles',
      items: matchedArticles,
    })
  }

  return groups
}

export function useCommandPaletteSearch(options: UseCommandPaletteSearchOptions = {}) {
  const storageKey = options.storageKey || RECENT_KEY
  const maxRecentCount = options.maxRecentCount ?? 5

  const searchQuery = ref('')
  const recentSearches = ref<RecentSearchItem[]>([])

  function loadRecentSearches() {
    try {
      if (typeof localStorage === 'undefined') return
      const raw = localStorage.getItem(storageKey)
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

    const filtered = recentSearches.value.filter(
      (r) => r.query.toLowerCase() !== trimmed.toLowerCase(),
    )
    filtered.unshift({ query: trimmed, timestamp: Date.now() })
    recentSearches.value = filtered.slice(0, maxRecentCount)

    try {
      if (typeof localStorage === 'undefined') return
      localStorage.setItem(storageKey, JSON.stringify(recentSearches.value))
    } catch {
      // Ignore storage errors
    }
  }

  function clearRecentSearches() {
    recentSearches.value = []
    try {
      if (typeof localStorage === 'undefined') return
      localStorage.removeItem(storageKey)
    } catch {
      // Ignore storage errors
    }
    options.onRecentCleared?.()
  }

  const groupedItems = computed<GroupedCategory[]>(() => {
    return rankAndGroupCommandItems(
      searchQuery.value,
      {
        staticPages: resolveItems(options.staticPages),
        quickActions: resolveItems(options.quickActions),
        themeItems: resolveItems(options.themeItems),
        projectItems: resolveItems(options.projectItems),
        blogItems: resolveItems(options.blogItems),
        weatherItems: resolveItems(options.weatherItems),
      },
      recentSearches.value,
      (selectedQuery) => {
        searchQuery.value = selectedQuery
      },
    )
  })

  // Flattened list for linear arrow navigation
  const flatItems = computed<CommandItem[]>(() => {
    return groupedItems.value.flatMap((g) => g.items)
  })

  return {
    searchQuery,
    recentSearches,
    groupedItems,
    flatItems,
    loadRecentSearches,
    saveRecentSearch,
    clearRecentSearches,
  }
}
