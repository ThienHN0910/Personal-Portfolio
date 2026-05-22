import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { applySeo, type SeoMetaInput } from '@/utils/seo'

type RouteSeoMeta = Pick<SeoMetaInput, 'title' | 'description' | 'keywords' | 'image' | 'type' | 'noindex'>

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        seo: {
          title: 'Home',
          description: 'Portfolio of ThienHN featuring selected projects, technical profile, and latest updates.',
        } satisfies RouteSeoMeta,
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: {
        seo: {
          title: 'About',
          description: 'Learn more about ThienHN, work experience, skills, education, and certifications.',
        } satisfies RouteSeoMeta,
      },
    },
    {
      path: '/cv',
      name: 'cv-viewer',
      component: () => import('@/views/CvViewerView.vue'),
      meta: {
        seo: {
          title: 'CV',
          description: 'View and download the latest CV of ThienHN.',
        } satisfies RouteSeoMeta,
      },
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/ProjectsView.vue'),
      meta: {
        seo: {
          title: 'Projects',
          description: 'Explore portfolio projects including live demos, source code, and technical details.',
        } satisfies RouteSeoMeta,
      },
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: () => import('@/views/ProjectDetailView.vue'),
      meta: {
        seo: {
          title: 'Project Detail',
          description: 'Detailed case study with technologies and links for this project.',
          type: 'article',
        } satisfies RouteSeoMeta,
      },
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/BlogView.vue'),
      meta: {
        seo: {
          title: 'Blog',
          description: 'Read blog posts about web development, software engineering, and implementation notes.',
        } satisfies RouteSeoMeta,
      },
    },
    {
      path: '/blog/:id',
      name: 'blog-post',
      component: () => import('@/views/BlogPostView.vue'),
      meta: {
        seo: {
          title: 'Blog Post',
          description: 'In-depth technical article from the portfolio blog.',
          type: 'article',
        } satisfies RouteSeoMeta,
      },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
      meta: {
        seo: {
          title: 'Contact',
          description: 'Send a message for collaboration, freelance work, or technical discussion.',
        } satisfies RouteSeoMeta,
      },
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('@/views/AuthCallbackView.vue'),
      meta: {
        seo: {
          title: 'Auth Callback',
          description: 'Authentication callback route.',
          noindex: true,
        } satisfies RouteSeoMeta,
      },
    },
    {
      path: '/admin',
      component: () => import('@/components/admin/AdminLayout.vue'),
      meta: {
        seo: {
          title: 'Admin',
          description: 'Portfolio admin panel.',
          noindex: true,
        } satisfies RouteSeoMeta,
      },
      children: [
        {
          path: '',
          name: 'admin',
          component: () => import('@/views/admin/AdminDashboard.vue'),
        },
        {
          path: 'projects',
          name: 'admin-projects',
          component: () => import('@/views/admin/AdminProjects.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'blog',
          name: 'admin-blog',
          component: () => import('@/views/admin/AdminBlog.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('@/views/admin/AdminCategories.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'messages',
          name: 'admin-messages',
          component: () => import('@/views/admin/AdminMessages.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'about',
          name: 'admin-about',
          component: () => import('@/views/admin/AdminAbout.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'appearance',
          name: 'admin-appearance',
          component: () => import('@/views/admin/AdminAppearance.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/admin')
  } else {
    next()
  }
})

router.afterEach((to) => {
  const routeSeo = (to.meta.seo || {}) as RouteSeoMeta
  applySeo({
    ...routeSeo,
    url: to.path,
  })
})

export default router
