<template>
  <div class="section admin-shell min-h-screen py-8">
    <div class="container space-y-8">
      <AdminSectionHeader kicker="Telemetry & Security" title-before="Visitor " title-highlight="Analytics & Logs" />

      <!-- Metric Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="glass-panel p-6 border border-stroke relative overflow-hidden">
          <div class="text-xs font-mono text-ink-secondary uppercase tracking-wider mb-1">Total Pageviews</div>
          <div class="text-3xl font-extrabold text-ink font-mono">{{ stats?.totalViews || 0 }}</div>
          <div class="mt-2 text-xs text-pastel-blue-text font-mono">All-time tracked hits</div>
        </div>

        <div class="glass-panel p-6 border border-stroke relative overflow-hidden">
          <div class="text-xs font-mono text-ink-secondary uppercase tracking-wider mb-1">Unique Visitors (IPs)</div>
          <div class="text-3xl font-extrabold text-emerald-400 font-mono">{{ stats?.uniqueVisitors || 0 }}</div>
          <div class="mt-2 text-xs text-emerald-500 font-mono">Distinct IP addresses</div>
        </div>

        <div class="glass-panel p-6 border border-stroke relative overflow-hidden">
          <div class="text-xs font-mono text-ink-secondary uppercase tracking-wider mb-1">Last 24 Hours</div>
          <div class="text-3xl font-extrabold text-indigo-400 font-mono">{{ stats?.viewsPast24h || 0 }}</div>
          <div class="mt-2 text-xs text-indigo-300 font-mono">Recent activity</div>
        </div>

        <div class="glass-panel p-6 border border-purple-500/40 relative overflow-hidden bg-purple-950/10">
          <div class="text-xs font-mono text-purple-300 uppercase tracking-wider mb-1">CV / Company Visitors</div>
          <div class="text-3xl font-extrabold text-purple-400 font-mono">{{ stats?.companyViews || 0 }}</div>
          <div class="mt-2 text-xs text-purple-300 font-mono">Tracked via ?from= query</div>
        </div>
      </div>

      <!-- CV Company Tracking Summary -->
      <div v-if="stats?.topCompanies && stats.topCompanies.length" class="glass-panel p-6 border border-purple-500/30">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-mono text-purple-300 uppercase tracking-wider font-semibold flex items-center gap-2">
            <span>🏢</span> Top Companies Viewing CV / Portfolio
          </h3>
          <span class="text-xs font-mono text-ink-secondary">Click company to filter</span>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="item in stats.topCompanies"
            :key="item.company"
            type="button"
            class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-200 hover:bg-purple-500/20 transition-all text-left"
            @click="filterByCompany(item.company)"
          >
            <span class="font-bold text-ink">{{ item.company }}</span>
            <span class="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-bold">{{ item.count }} hits</span>
          </button>
        </div>
      </div>

      <!-- Popular Pages Summary -->
      <div v-if="stats?.topPages && stats.topPages.length" class="glass-panel p-6 border border-stroke-soft">
        <h3 class="text-sm font-mono text-pastel-blue-text uppercase tracking-wider font-semibold mb-4">Most Visited Paths</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="page in stats.topPages"
            :key="page.path"
            class="flex items-center justify-between p-3 rounded-lg bg-bone border border-stroke-soft text-xs font-mono"
          >
            <span class="text-ink truncate max-w-[200px]" :title="page.path">{{ page.path }}</span>
            <span class="px-2 py-0.5 rounded bg-pastel-blue text-pastel-blue-text font-bold">{{ page.count }} hits</span>
          </div>
        </div>
      </div>

      <!-- Mode Selector & Controls -->
      <div class="glass-panel p-6 border border-stroke-soft space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Tab View Switcher -->
          <div class="flex items-center p-1 rounded-xl bg-surface border border-stroke-soft text-xs font-mono">
            <button
              type="button"
              class="px-4 py-2 rounded-lg transition-all font-semibold flex items-center gap-2"
              :class="viewMode === 'grouped' ? 'bg-ink text-surface shadow' : 'text-ink-secondary hover:text-ink'"
              @click="switchViewMode('grouped')"
            >
              <span>🌐</span> Grouped by IP Address
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-lg transition-all font-semibold flex items-center gap-2"
              :class="viewMode === 'raw' ? 'bg-ink text-surface shadow' : 'text-ink-secondary hover:text-ink'"
              @click="switchViewMode('raw')"
            >
              <span>📋</span> Chronological Logs
            </button>
          </div>

          <!-- Bulk Actions -->
          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold hover:bg-amber-500/20 transition-all"
              :disabled="analyticsStore.loading"
              @click="handleClearOlderThan30Days"
            >
              Clear > 30 Days
            </button>
            <button
              type="button"
              class="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold hover:bg-rose-500/20 transition-all"
              :disabled="analyticsStore.loading"
              @click="handleClearAllLogs"
            >
              Clear All Logs
            </button>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="relative w-full">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search IP, path, company (e.g. Google), city, country, or user-agent..."
            class="w-full pl-4 pr-24 py-2.5 rounded-xl bg-surface border border-stroke-soft text-ink placeholder-ink-tertiary font-mono text-xs focus:outline-none focus:border-ink"
            @keyup.enter="handleSearch"
          />
          <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              v-if="searchQuery"
              type="button"
              class="text-xs text-ink-secondary hover:text-ink font-mono px-2"
              @click="clearSearch"
            >
              Clear
            </button>
            <button
              type="button"
              class="px-3 py-1 rounded-lg bg-pastel-blue border border-stroke text-pastel-blue-text font-mono text-xs font-semibold hover:bg-pastel-blue"
              @click="handleSearch"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <LoadingSpinner v-if="analyticsStore.loading && !analyticsStore.logs.length && !analyticsStore.groupedIps.length" />

      <!-- GROUPED BY IP VIEW -->
      <div v-else-if="viewMode === 'grouped'" class="space-y-4">
        <div v-if="analyticsStore.groupedIps.length" class="space-y-4">
          <div
            v-for="group in analyticsStore.groupedIps"
            :key="group.ip"
            class="glass-panel border border-stroke overflow-hidden transition-all"
          >
            <!-- IP Header Bar -->
            <div class="p-5 flex flex-wrap items-center justify-between gap-4 bg-bone border-b border-stroke-soft">
              <div class="space-y-1 min-w-[260px]">
                <div class="flex items-center gap-2">
                  <span class="text-base" :title="group.ipInfo?.country || 'Unknown'">
                    {{ getCountryFlag(group.ipInfo?.countryCode) }}
                  </span>
                  <span class="text-sm font-mono font-bold text-pastel-blue-text">{{ group.ip }}</span>
                  
                  <!-- Location Tag -->
                  <span
                    v-if="group.ipInfo?.city || group.ipInfo?.country"
                    class="px-2 py-0.5 rounded bg-bone text-ink font-mono text-[11px]"
                  >
                    {{ group.ipInfo.city ? group.ipInfo.city + ', ' : '' }}{{ group.ipInfo.country }}
                  </span>
                </div>

                <!-- ISP / Network Org -->
                <div v-if="group.ipInfo?.org" class="text-xs font-mono text-ink-secondary truncate max-w-md">
                  🏢 {{ group.ipInfo.org }}
                </div>
              </div>

              <!-- Companies Badges & Metrics -->
              <div class="flex flex-wrap items-center gap-3">
                <div v-if="group.companies && group.companies.length" class="flex flex-wrap gap-1.5">
                  <span
                    v-for="comp in group.companies"
                    :key="comp"
                    class="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-200 font-mono text-xs font-bold"
                  >
                    🏢 CV: {{ comp }}
                  </span>
                </div>

                <div class="text-right font-mono text-xs text-ink-secondary">
                  <span class="px-2.5 py-1 rounded bg-pastel-blue border border-stroke text-pastel-blue-text font-bold">
                    {{ group.totalViews }} pages visited
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-lg bg-bone border border-stroke-soft hover:bg-bone text-xs font-mono text-ink transition-all flex items-center gap-1.5"
                    @click="toggleExpand(group.ip)"
                  >
                    <span>{{ expandedIps.has(group.ip) ? '▼ Hide' : '▶ History' }}</span>
                    <span class="text-ink-secondary">({{ group.history.length }})</span>
                  </button>

                  <button
                    type="button"
                    class="px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition-all text-xs font-mono"
                    title="Delete all logs for this IP"
                    @click="handleDeleteIp(group.ip)"
                  >
                    Delete IP
                  </button>
                </div>
              </div>
            </div>

            <!-- Expandable History Timeline -->
            <div v-if="expandedIps.has(group.ip)" class="p-5 bg-bone border-t border-stroke-soft font-mono text-xs">
              <div class="text-ink-secondary uppercase tracking-wider text-[11px] mb-3 font-semibold flex items-center justify-between">
                <span>Navigation Journey Timeline (Oldest to Newest)</span>
                <span>Last active: {{ formatDate(group.lastSeen) }}</span>
              </div>

              <div class="space-y-2 relative border-l-2 border-stroke pl-4 ml-2 my-2">
                <div
                  v-for="(hit, idx) in group.history"
                  :key="hit._id || idx"
                  class="relative group flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-bone hover:bg-bone transition-all"
                >
                  <!-- Timeline Node Dot -->
                  <div class="absolute -left-[21px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-pastel-blue-text border border-stroke-soft"></div>

                  <div class="flex flex-wrap items-center gap-2 min-w-0">
                    <span class="text-ink-secondary text-[11px] whitespace-nowrap">{{ formatDate(hit.createdAt) }}</span>
                    <span class="font-bold text-ink bg-bone px-2 py-0.5 rounded border border-stroke-soft truncate max-w-md">
                      {{ hit.path }}
                    </span>
                    <span v-if="hit.fromCompany" class="px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 font-bold text-[10px]">
                      🏢 {{ hit.fromCompany }}
                    </span>
                  </div>

                  <div class="text-[11px] text-ink-secondary truncate max-w-xs" :title="hit.referrer || hit.userAgent">
                    {{ hit.referrer ? 'Ref: ' + hit.referrer : (hit.userAgent || '—') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="glass-panel p-12 text-center text-ink-tertiary font-mono">
          No visitor logs found matching your filter.
        </div>

        <!-- Grouped Pagination Footer -->
        <div v-if="analyticsStore.groupedTotalPages > 1" class="flex items-center justify-between font-mono text-xs text-ink-secondary">
          <div>
            Page {{ analyticsStore.groupedPage }} of {{ analyticsStore.groupedTotalPages }} ({{ analyticsStore.totalGrouped }} total IPs)
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-3 py-1.5 rounded bg-bone border border-stroke-soft disabled:opacity-40"
              :disabled="analyticsStore.groupedPage <= 1"
              @click="changeGroupedPage(analyticsStore.groupedPage - 1)"
            >
              ← Previous
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded bg-bone border border-stroke-soft disabled:opacity-40"
              :disabled="analyticsStore.groupedPage >= analyticsStore.groupedTotalPages"
              @click="changeGroupedPage(analyticsStore.groupedPage + 1)"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <!-- RAW CHRONOLOGICAL LOGS VIEW -->
      <div v-else-if="viewMode === 'raw'" class="space-y-4">
        <div v-if="analyticsStore.logs.length" class="glass-panel overflow-x-auto border border-stroke-soft">
          <table class="w-full text-left text-xs font-mono">
            <thead class="bg-bone border-b border-stroke-soft text-ink-secondary uppercase tracking-wider">
              <tr>
                <th class="p-4">Timestamp</th>
                <th class="p-4">IP & Location</th>
                <th class="p-4">Path</th>
                <th class="p-4">Source / Company</th>
                <th class="p-4">User-Agent</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stroke-soft text-ink">
              <tr v-for="log in analyticsStore.logs" :key="log._id" class="hover:bg-bone transition-colors">
                <td class="p-4 text-ink-secondary whitespace-nowrap">{{ formatDate(log.createdAt) }}</td>
                <td class="p-4 whitespace-nowrap">
                  <div class="font-bold text-pastel-blue-text flex items-center gap-1.5">
                    <span>{{ getCountryFlag(log.ipInfo?.countryCode) }}</span>
                    <span>{{ log.ip }}</span>
                  </div>
                  <div v-if="log.ipInfo?.city || log.ipInfo?.country" class="text-[10px] text-ink-secondary">
                    {{ log.ipInfo.city ? log.ipInfo.city + ', ' : '' }}{{ log.ipInfo.country }}
                  </div>
                </td>
                <td class="p-4 text-ink whitespace-nowrap font-medium">{{ log.path }}</td>
                <td class="p-4 whitespace-nowrap">
                  <span
                    v-if="log.fromCompany"
                    class="px-2.5 py-1 rounded bg-purple-500/20 border border-purple-500/40 text-purple-200 font-bold text-xs"
                  >
                    🏢 {{ log.fromCompany }}
                  </span>
                  <span v-else-if="log.referrer" class="text-ink-secondary text-[11px] truncate max-w-[150px]" :title="log.referrer">
                    {{ log.referrer }}
                  </span>
                  <span v-else class="text-ink-tertiary">—</span>
                </td>
                <td class="p-4 text-ink-secondary max-w-xs truncate" :title="log.userAgent">{{ log.userAgent || '—' }}</td>
                <td class="p-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition-all"
                    @click="handleDeleteSingleLog(log._id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="glass-panel p-12 text-center text-ink-tertiary font-mono">
          No visitor logs recorded yet.
        </div>

        <!-- Raw Pagination Footer -->
        <div v-if="analyticsStore.totalPages > 1" class="flex items-center justify-between font-mono text-xs text-ink-secondary">
          <div>
            Page {{ analyticsStore.currentPage }} of {{ analyticsStore.totalPages }} ({{ analyticsStore.totalLogs }} total logs)
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-3 py-1.5 rounded bg-bone border border-stroke-soft disabled:opacity-40"
              :disabled="analyticsStore.currentPage <= 1"
              @click="changeRawPage(analyticsStore.currentPage - 1)"
            >
              ← Previous
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded bg-bone border border-stroke-soft disabled:opacity-40"
              :disabled="analyticsStore.currentPage >= analyticsStore.totalPages"
              @click="changeRawPage(analyticsStore.currentPage + 1)"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        :open="isConfirmOpen"
        :title="confirmTitle"
        :message="confirmMessage"
        confirm-text="Confirm Delete"
        @cancel="cancelConfirm"
        @confirm="executeConfirm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import AdminSectionHeader from '@/components/admin/AdminSectionHeader.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useAnalyticsStore } from '@/stores/analytics'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

const analyticsStore = useAnalyticsStore()
const stats = computed(() => analyticsStore.stats)
const searchQuery = ref('')
const viewMode = ref<'grouped' | 'raw'>('grouped')
const expandedIps = ref<Set<string>>(new Set())

const isConfirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
let confirmAction: (() => Promise<void>) | null = null

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  return dateFormatter.format(new Date(dateStr))
}

function getCountryFlag(code?: string): string {
  if (!code || code === 'LOCAL') return '🏠'
  if (code.length !== 2) return '🌐'
  const codePoints = code
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

function toggleExpand(ip: string): void {
  if (expandedIps.value.has(ip)) {
    expandedIps.value.delete(ip)
  } else {
    expandedIps.value.add(ip)
  }
}

function switchViewMode(mode: 'grouped' | 'raw'): void {
  viewMode.value = mode
  if (mode === 'grouped') {
    void analyticsStore.fetchGroupedLogs(1, searchQuery.value)
  } else {
    void analyticsStore.fetchLogs(1, searchQuery.value)
  }
}

function handleSearch(): void {
  if (viewMode.value === 'grouped') {
    void analyticsStore.fetchGroupedLogs(1, searchQuery.value)
  } else {
    void analyticsStore.fetchLogs(1, searchQuery.value)
  }
}

function filterByCompany(company: string): void {
  searchQuery.value = company
  handleSearch()
}

function clearSearch(): void {
  searchQuery.value = ''
  handleSearch()
}

function changeGroupedPage(page: number): void {
  void analyticsStore.fetchGroupedLogs(page, searchQuery.value)
}

function changeRawPage(page: number): void {
  void analyticsStore.fetchLogs(page, searchQuery.value)
}

function handleDeleteIp(ip: string): void {
  confirmTitle.value = 'Delete All Logs for IP'
  confirmMessage.value = `Are you sure you want to delete all recorded visitor logs for IP address ${ip}?`
  confirmAction = async () => {
    await analyticsStore.deleteIpLogs(ip)
  }
  isConfirmOpen.value = true
}

function handleDeleteSingleLog(id: string): void {
  confirmTitle.value = 'Delete Log Entry'
  confirmMessage.value = 'Are you sure you want to delete this visitor log entry?'
  confirmAction = async () => {
    await analyticsStore.deleteLog(id)
  }
  isConfirmOpen.value = true
}

function handleClearOlderThan30Days(): void {
  confirmTitle.value = 'Clear Logs Older Than 30 Days'
  confirmMessage.value = 'This will delete all visitor log records created over 30 days ago.'
  confirmAction = async () => {
    await analyticsStore.clearLogs('olderThanDays', 30)
  }
  isConfirmOpen.value = true
}

function handleClearAllLogs(): void {
  confirmTitle.value = 'Clear All Logs'
  confirmMessage.value = 'Warning: This will permanently purge all recorded visitor logs.'
  confirmAction = async () => {
    await analyticsStore.clearLogs('all')
  }
  isConfirmOpen.value = true
}

function cancelConfirm(): void {
  isConfirmOpen.value = false
  confirmAction = null
}

async function executeConfirm(): Promise<void> {
  if (confirmAction) {
    await confirmAction()
  }
  isConfirmOpen.value = false
  confirmAction = null
}

onMounted(() => {
  void analyticsStore.fetchStats()
  void analyticsStore.fetchGroupedLogs(1)
})
</script>
