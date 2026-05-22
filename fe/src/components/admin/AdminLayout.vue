<template>
  <div class="admin-layout">
    <aside v-if="authStore.isAuthenticated" class="admin-sidebar" :class="{ 'is-open': sidebarOpen }">
      <div class="admin-sidebar__brand">
        <RouterLink to="/admin" class="admin-sidebar__logo">Portfolio CMS</RouterLink>
        <button class="admin-sidebar__close" type="button" @click="sidebarOpen = false">Close</button>
      </div>

      <nav class="admin-sidebar__nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="admin-sidebar__link"
          @click="sidebarOpen = false"
        >
          <IconGlyph :name="item.icon" :size="16" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="admin-sidebar__footer">
        <p class="admin-sidebar__theme">Theme: {{ themeName }}</p>
        <button type="button" class="btn btn--secondary btn--sm admin-sidebar__logout" @click="handleLogout">
          Logout
        </button>
      </div>
    </aside>

    <div v-if="authStore.isAuthenticated && sidebarOpen" class="admin-sidebar__overlay" @click="sidebarOpen = false" />

    <div class="admin-layout__main">
      <div v-if="authStore.isAuthenticated" class="admin-layout__mobile-bar">
        <button class="btn btn--secondary btn--sm" type="button" @click="sidebarOpen = true">Menu</button>
        <p class="admin-layout__mobile-title">Admin Panel</p>
      </div>

      <div v-if="!authStore.isAuthenticated" class="admin-login-gate">
        <div class="admin-login-gate__card">
          <p class="admin-login-gate__kicker">Admin Access</p>
          <h1 class="admin-login-gate__title">Sign in to continue</h1>
          <p class="admin-login-gate__desc">
            To manage projects, blogs, messages and theme settings, please login with your admin account.
          </p>
          <button type="button" class="btn btn--primary" @click="authStore.loginWithGoogle">Login with Google</button>
        </div>
      </div>

      <RouterView v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import IconGlyph from '@/components/ui/IconGlyph.vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const sidebarOpen = ref(false)

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard' as const },
  { to: '/admin/projects', label: 'Projects', icon: 'projects' as const },
  { to: '/admin/blog', label: 'Blog', icon: 'blog' as const },
  { to: '/admin/categories', label: 'Categories', icon: 'featured' as const },
  { to: '/admin/messages', label: 'Messages', icon: 'messages' as const },
  { to: '/admin/about', label: 'Content', icon: 'about' as const },
  { to: '/admin/appearance', label: 'Appearance', icon: 'appearance' as const },
]

const themeName = computed(() => themeStore.theme.name || 'Default')

watch(() => route.fullPath, () => {
  sidebarOpen.value = false
})

function handleLogout(): void {
  authStore.logout()
  sidebarOpen.value = false
  router.push('/')
}
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(165deg, rgba(2, 6, 23, 0.92), rgba(15, 23, 42, 0.88));
}

.admin-sidebar {
  width: 280px;
  border-right: 1px solid rgba(148, 163, 184, 0.2);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(11, 18, 32, 0.95));
  backdrop-filter: blur(10px);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-sidebar__brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.admin-sidebar__logo {
  color: #f8fafc;
  text-decoration: none;
  font-weight: 800;
  letter-spacing: 0.03em;
}

.admin-sidebar__close {
  display: none;
  border: 0;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
}

.admin-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.admin-sidebar__link {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  border-radius: 0.8rem;
  border: 1px solid transparent;
  color: #cbd5e1;
  text-decoration: none;
  padding: 0.6rem 0.75rem;
  font-size: 0.92rem;
  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.admin-sidebar__link:hover,
.admin-sidebar__link.router-link-active {
  color: #f8fafc;
  border-color: color-mix(in srgb, var(--theme-primary) 45%, transparent);
  background: color-mix(in srgb, var(--theme-primary) 16%, transparent);
}

.admin-sidebar__theme {
  margin: 0;
  margin-bottom: 0;
  color: #94a3b8;
  font-size: 0.78rem;
}

.admin-sidebar__footer {
  margin-top: auto;
  display: grid;
  gap: 0.6rem;
}

.admin-sidebar__logout {
  width: 100%;
}

.admin-layout__main {
  flex: 1;
  min-width: 0;
}

.admin-login-gate {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem 1rem;
}

.admin-login-gate__card {
  width: min(100%, 540px);
  border-radius: 1.2rem;
  border: 1px solid rgba(148, 163, 184, 0.24);
  background:
    radial-gradient(circle at 84% 16%, color-mix(in srgb, var(--theme-secondary) 20%, transparent), transparent 40%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.95), rgba(11, 18, 32, 0.93));
  padding: 2rem;
  box-shadow: 0 28px 60px -42px rgba(0, 0, 0, 0.85);
}

.admin-login-gate__kicker {
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: color-mix(in srgb, var(--theme-accent) 86%, white);
  font-size: 0.74rem;
  font-weight: 700;
}

.admin-login-gate__title {
  margin: 0;
  color: #f8fafc;
  font-size: clamp(1.7rem, 2.3vw, 2.1rem);
  line-height: 1.2;
}

.admin-login-gate__desc {
  margin: 0.95rem 0 1.3rem;
  color: #a8b4c8;
  line-height: 1.7;
}

.admin-layout__mobile-bar {
  display: none;
  position: sticky;
  top: 0;
  z-index: 15;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.92);
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.admin-layout__mobile-title {
  margin: 0;
  color: #f8fafc;
  font-weight: 700;
}

.admin-sidebar__overlay {
  display: none;
}

@media (max-width: 1023px) {
  .admin-layout {
    display: block;
  }

  .admin-layout__mobile-bar {
    display: flex;
  }

  .admin-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 30;
    transform: translateX(-100%);
    transition: transform 0.22s ease;
    box-shadow: 0 24px 70px rgba(2, 6, 23, 0.7);
  }

  .admin-sidebar.is-open {
    transform: translateX(0);
  }

  .admin-sidebar__close {
    display: inline-flex;
  }

  .admin-sidebar__overlay {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 25;
    background: rgba(2, 6, 23, 0.55);
    backdrop-filter: blur(3px);
  }
}
</style>
