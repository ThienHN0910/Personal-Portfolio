import type { BlogPost, Project } from '@/types'

function normalizeToken(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9]/g, '')
}

/**
 * Computes the related projects for a given project.
 */
export function getRelatedProjectsForProject(
  current: Project,
  allProjects: Project[],
  limit = 2
): Project[] {
  const currentId = current.slug || current._id
  const currentCategories = (current.categories || []).map(normalizeToken)
  const currentTechs = (current.technologies || []).map(normalizeToken)

  return allProjects
    .filter((p) => (p.slug || p._id) !== currentId)
    .map((p) => {
      let score = 0
      const pCategories = (p.categories || []).map(normalizeToken)
      const pTechs = (p.technologies || []).map(normalizeToken)

      // Category overlap (+3 points each)
      for (const cat of pCategories) {
        if (currentCategories.includes(cat)) score += 3
      }

      // Tech overlap (+2 points each)
      for (const tech of pTechs) {
        if (currentTechs.includes(tech)) score += 2
      }

      if (p.featured) score += 1

      return { project: p, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.project)
}

/**
 * Computes related articles for a given project based on tech & category overlap.
 */
export function getRelatedArticlesForProject(
  current: Project,
  allPosts: BlogPost[],
  limit = 2
): BlogPost[] {
  const currentCategories = (current.categories || []).map(normalizeToken)
  const currentTechs = (current.technologies || []).map(normalizeToken)

  return allPosts
    .map((post) => {
      let score = 0
      const postCategories = (post.categories || []).map(normalizeToken)
      const postTags = (post.tags || []).map(normalizeToken)

      // Category overlap (+3 points)
      for (const cat of postCategories) {
        if (currentCategories.includes(cat)) score += 3
      }

      // Tag overlap with project technologies (+3 points)
      for (const tag of postTags) {
        if (currentTechs.includes(tag)) score += 3
        if (currentCategories.includes(tag)) score += 2
      }

      return { post, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post)
}

/**
 * Computes related articles for a given blog post.
 */
export function getRelatedArticlesForPost(
  current: BlogPost,
  allPosts: BlogPost[],
  limit = 2
): BlogPost[] {
  const currentId = current.slug || current._id
  const currentCategories = (current.categories || []).map(normalizeToken)
  const currentTags = (current.tags || []).map(normalizeToken)

  return allPosts
    .filter((p) => (p.slug || p._id) !== currentId)
    .map((p) => {
      let score = 0
      const pCategories = (p.categories || []).map(normalizeToken)
      const pTags = (p.tags || []).map(normalizeToken)

      for (const cat of pCategories) {
        if (currentCategories.includes(cat)) score += 3
      }

      for (const tag of pTags) {
        if (currentTags.includes(tag)) score += 2
      }

      return { post: p, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post)
}

/**
 * Computes related projects for a given blog post based on tech stack & category overlap.
 */
export function getRelatedProjectsForPost(
  current: BlogPost,
  allProjects: Project[],
  limit = 2
): Project[] {
  const currentCategories = (current.categories || []).map(normalizeToken)
  const currentTags = (current.tags || []).map(normalizeToken)

  return allProjects
    .map((proj) => {
      let score = 0
      const projCategories = (proj.categories || []).map(normalizeToken)
      const projTechs = (proj.technologies || []).map(normalizeToken)

      for (const tech of projTechs) {
        if (currentTags.includes(tech)) score += 3
        if (currentCategories.includes(tech)) score += 2
      }

      for (const cat of projCategories) {
        if (currentCategories.includes(cat)) score += 2
      }

      if (proj.featured) score += 1

      return { project: proj, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.project)
}
