import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { AnalyticsStats, GroupedIpItem, VisitorLogItem } from '@/types'
import api from '@/utils/api'

export const useAnalyticsStore = defineStore('analytics', () => {
  const stats = ref<AnalyticsStats | null>(null)
  const logs = ref<VisitorLogItem[]>([])
  const groupedIps = ref<GroupedIpItem[]>([])
  
  const totalLogs = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(1)

  const totalGrouped = ref(0)
  const groupedPage = ref(1)
  const groupedTotalPages = ref(1)

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function trackVisit(path: string, fromCompany?: string): Promise<void> {
    try {
      await api.post('/analytics/track', {
        path,
        fromCompany: fromCompany || '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      })
    } catch {
      // Silently ignore tracking errors to not disrupt user navigation
    }
  }

  async function fetchStats(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<{ success: boolean; data: AnalyticsStats }>('/analytics/stats')
      if (response.data.success && response.data.data) {
        stats.value = response.data.data
      }
    } catch (err) {
      error.value = 'Failed to fetch analytics statistics'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchLogs(page = 1, search = ''): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<{
        success: boolean
        data: VisitorLogItem[]
        pagination: { total: number; page: number; limit: number; totalPages: number }
      }>('/analytics/logs', {
        params: { page, limit: 25, search },
      })

      if (response.data.success) {
        logs.value = response.data.data
        totalLogs.value = response.data.pagination.total
        currentPage.value = response.data.pagination.page
        totalPages.value = response.data.pagination.totalPages
      }
    } catch (err) {
      error.value = 'Failed to fetch visitor logs'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchGroupedLogs(page = 1, search = ''): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<{
        success: boolean
        data: GroupedIpItem[]
        pagination: { total: number; page: number; limit: number; totalPages: number }
      }>('/analytics/grouped-ips', {
        params: { page, limit: 15, search },
      })

      if (response.data.success) {
        groupedIps.value = response.data.data
        totalGrouped.value = response.data.pagination.total
        groupedPage.value = response.data.pagination.page
        groupedTotalPages.value = response.data.pagination.totalPages
      }
    } catch (err) {
      error.value = 'Failed to fetch grouped IP analytics'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function deleteLog(id: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/analytics/logs/${id}`)
      logs.value = logs.value.filter((log) => log._id !== id)
      totalLogs.value = Math.max(0, totalLogs.value - 1)
    } catch (err) {
      error.value = 'Failed to delete log entry'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteIpLogs(ip: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/analytics/logs/ip/${encodeURIComponent(ip)}`)
      groupedIps.value = groupedIps.value.filter((item) => item.ip !== ip)
      logs.value = logs.value.filter((log) => log.ip !== ip)
      await fetchStats()
    } catch (err) {
      error.value = 'Failed to delete logs for IP'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function clearLogs(mode: 'all' | 'olderThanDays', days = 30): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await api.delete('/analytics/logs', {
        params: { mode, days },
      })
      await Promise.all([fetchStats(), fetchLogs(1), fetchGroupedLogs(1)])
    } catch (err) {
      error.value = 'Failed to clear logs'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    logs,
    groupedIps,
    totalLogs,
    currentPage,
    totalPages,
    totalGrouped,
    groupedPage,
    groupedTotalPages,
    loading,
    error,
    trackVisit,
    fetchStats,
    fetchLogs,
    fetchGroupedLogs,
    deleteLog,
    deleteIpLogs,
    clearLogs,
  }
})
