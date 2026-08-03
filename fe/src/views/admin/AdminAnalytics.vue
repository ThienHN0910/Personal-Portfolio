<template>
  <div class="section admin-shell min-h-screen py-8">
    <div class="container space-y-8">
      <AdminSectionHeader kicker="Telemetry & Security" title-before="Visitor " title-highlight="Analytics & Logs" />

      <!-- Metric Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="glass-panel p-6 border border-cyber-border/40 relative overflow-hidden">
          <div class="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Total Pageviews</div>
          <div class="text-3xl font-extrabold text-white font-mono">{{ stats?.totalViews || 0 }}</div>
          <div class="mt-2 text-xs text-cyber-cyan font-mono">All-time tracked hits</div>
        </div>

        <div class="glass-panel p-6 border border-cyber-border/40 relative overflow-hidden">
          <div class="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Unique Visitors (IPs)</div>
          <div class="text-3xl font-extrabold text-emerald-400 font-mono">{{ stats?.uniqueVisitors || 0 }}</div>
          <div class="mt-2 text-xs text-emerald-500 font-mono">Distinct IP addresses</div>
        </div>

        <div class="glass-panel p-6 border border-cyber-border/40 relative overflow-hidden">
          <div class="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Last 24 Hours</div>
          <div class="text-3xl font-extrabold text-indigo-400 font-mono">{{ stats?.viewsPast24h || 0 }}</div>
          <div class="mt-2 text-xs text-indigo-300 font-mono">Recent activity</div>
        </div>
      </div>

      <!-- Popular Pages Summary -->
      <div v-if="stats?.topPages && stats.topPages.length" class="glass-panel p-6 border border-cyber-border/30">
        <h3 class="text-sm font-mono text-cyber-cyan uppercase tracking-wider font-semibold mb-4">Most Visited Paths</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="page in stats.topPages"
            :key="page.path"
            class="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 text-xs font-mono"
          >
            <span class="text-slate-200 truncate max-w-[200px]" :title="page.path">{{ page.path }}</span>
            <span class="px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan font-bold">{{ page.count }} hits</span>
          </div>
        </div>
      </div>

      <!-- Controls & Search Header -->
      <div class="glass-panel p-6 border border-cyber-border/30 flex flex-wrap items-center justify-between gap-4">
        <!-- Search Input -->
        <div class="relative flex-1 min-w-[240px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Filter by IP address, path, or user-agent..."
            class="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-cyber-cyan"
            @keyup.enter="handleSearch"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            @click="handleSearch"
          >
            Search
          </button>
        </div>

        <!-- Bulk Deletion Actions -->
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

      <LoadingSpinner v-if="analyticsStore.loading && !analyticsStore.logs.length" />

      <!-- Logs Table -->
      <div v-else-if="analyticsStore.logs.length" class="glass-panel overflow-x-auto border border-cyber-border/30">
        <table class="w-full text-left text-xs font-mono">
          <thead class="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider">
            <tr>
              <th class="p-4">Timestamp</th>
              <th class="p-4">IP Address</th>
              <th class="p-4">Path</th>
              <th class="p-4">User-Agent</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 text-slate-300">
            <tr v-for="log in analyticsStore.logs" :key="log._id" class="hover:bg-white/5 transition-colors">
              <td class="p-4 text-slate-400 whitespace-nowrap">{{ formatDate(log.createdAt) }}</td>
              <td class="p-4 font-bold text-cyber-cyan whitespace-nowrap">{{ log.ip }}</td>
              <td class="p-4 text-slate-200 whitespace-nowrap font-medium">{{ log.path }}</td>
              <td class="p-4 text-slate-400 max-w-xs truncate" :title="log.userAgent">{{ log.userAgent || '—' }}</td>
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

      <div v-else class="glass-panel p-12 text-center text-slate-500 font-mono">
        No visitor logs recorded yet.
      </div>

      <!-- Pagination Footer -->
      <div v-if="analyticsStore.totalPages > 1" class="flex items-center justify-between font-mono text-xs text-slate-400">
        <div>
          Page {{ analyticsStore.currentPage }} of {{ analyticsStore.totalPages }} ({{ analyticsStore.totalLogs }} total logs)
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded bg-white/5 border border-white/10 disabled:opacity-40"
            :disabled="analyticsStore.currentPage <= 1"
            @click="changePage(analyticsStore.currentPage - 1)"
          >
            ← Previous
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded bg-white/5 border border-white/10 disabled:opacity-40"
            :disabled="analyticsStore.currentPage >= analyticsStore.totalPages"
            @click="changePage(analyticsStore.currentPage + 1)"
          >
            Next →
          </button>
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

const isConfirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
let confirmAction: (() => Promise<void>) | null = null

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  return dateFormatter.format(new Date(dateStr))
}

function handleSearch(): void {
  void analyticsStore.fetchLogs(1, searchQuery.value)
}

function changePage(page: number): void {
  void analyticsStore.fetchLogs(page, searchQuery.value)
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
  void analyticsStore.fetchLogs(1)
})
</script>
