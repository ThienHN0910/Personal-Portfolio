import type { Experience } from '@/types'

const PRESENT_PATTERN = /(present|current|now|hien\s*tai)/i

function getMonthFromName(value: string): number | null {
  const months: Record<string, number> = {
    jan: 0,
    january: 0,
    feb: 1,
    february: 1,
    mar: 2,
    march: 2,
    apr: 3,
    april: 3,
    may: 4,
    jun: 5,
    june: 5,
    jul: 6,
    july: 6,
    aug: 7,
    august: 7,
    sep: 8,
    sept: 8,
    september: 8,
    oct: 9,
    october: 9,
    nov: 10,
    november: 10,
    dec: 11,
    december: 11,
  }

  const lowered = value.toLowerCase()
  for (const [key, monthIndex] of Object.entries(months)) {
    if (lowered.includes(key)) {
      return monthIndex
    }
  }

  const monthNumberMatch = lowered.match(/(?:thang|thg|month)\s*(\d{1,2})/)
  if (monthNumberMatch) {
    const parsed = Number.parseInt(monthNumberMatch[1], 10)
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 12) {
      return parsed - 1
    }
  }

  return null
}

function toDateScore(value?: string): number {
  if (!value) return 0

  const normalized = value.trim()
  if (!normalized) return 0

  if (PRESENT_PATTERN.test(normalized)) {
    return Number.MAX_SAFE_INTEGER
  }

  const direct = Date.parse(normalized)
  if (!Number.isNaN(direct)) {
    return direct
  }

  const yearMatches = normalized.match(/(19|20)\d{2}/g)
  if (!yearMatches?.length) {
    return 0
  }

  const year = Number.parseInt(yearMatches[yearMatches.length - 1], 10)
  const month = getMonthFromName(normalized) ?? 0
  return Date.UTC(year, month, 1)
}

function getExperienceRank(exp: Pick<Experience, 'startDate' | 'endDate'>): number {
  const end = toDateScore(exp.endDate)
  if (end === Number.MAX_SAFE_INTEGER) {
    return end
  }

  const start = toDateScore(exp.startDate)
  return Math.max(end, start)
}

export function sortExperiencesDescending<T extends Pick<Experience, 'startDate' | 'endDate'>>(experiences: T[]): T[] {
  return [...experiences].sort((a, b) => {
    const rankA = getExperienceRank(a)
    const rankB = getExperienceRank(b)

    if (rankA === rankB) {
      return toDateScore(b.startDate) - toDateScore(a.startDate)
    }

    return rankB - rankA
  })
}
