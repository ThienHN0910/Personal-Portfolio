import type { Model } from 'mongoose'

export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .trim()
    .replace(/[^a-z0-9 ]/g, '') // remove all non-alphanumeric characters except spaces
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
}

export async function resolveUniqueSlug(
  model: Model<any>,
  title: string,
  docId: any,
  fallback = 'item',
): Promise<string> {
  let baseSlug = generateSlug(title)
  if (!baseSlug) baseSlug = fallback
  let currentSlug = baseSlug
  let counter = 1

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await model.findOne({ slug: currentSlug, _id: { $ne: docId } })
    if (!existing) {
      return currentSlug
    }
    currentSlug = `${baseSlug}-${counter}`
    counter++
  }
}
