export function parsePositiveInteger(value: unknown): number | null {
  const raw = Array.isArray(value) ? value[0] : value
  if (typeof raw !== 'string') return null

  const parsed = Number.parseInt(raw, 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function buildSearchFilter(queryValue: unknown, fields: string[]): Record<string, unknown> {
  const raw = Array.isArray(queryValue) ? queryValue[0] : queryValue
  const term = typeof raw === 'string' ? raw.trim() : ''
  if (!term) return {}

  const regex = new RegExp(escapeRegExp(term), 'i')
  return {
    $or: fields.map((field) => ({ [field]: regex })),
  }
}

export function buildCategoryFilter(categoryValue: unknown): Record<string, unknown> {
  const raw = Array.isArray(categoryValue) ? categoryValue[0] : categoryValue
  const category = typeof raw === 'string' ? raw.trim() : ''
  if (!category) return {}

  return { categories: { $in: [new RegExp(`^${escapeRegExp(category)}$`, 'i')] } }
}

/** Resolves a route param that may be either a Mongo ObjectId or a slug. */
export function idOrSlugQuery(idOrSlug: string): Record<string, string> {
  return /^[0-9a-fA-F]{24}$/.test(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug }
}
