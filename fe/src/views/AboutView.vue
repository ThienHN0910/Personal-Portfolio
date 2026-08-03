<template>
  <div class="min-h-screen pt-6 pb-16 relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.08),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.08),transparent_30%)]" />

    <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
      <!-- Page Header -->
      <div class="glass-panel p-6 sm:p-10 border border-cyber-border/40 shadow-cyan-glow">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs mb-3">
          <span>TIỂU SỬ & KỸ NĂNG</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Hồ Ngọc Thiện <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-indigo-400 to-violet-400">(ThienHN)</span>
        </h1>
        <p class="mt-3 text-slate-300 text-base max-w-2xl leading-relaxed">
          Hành trình phát triển sự nghiệp, kinh nghiệm thực chiến, bằng cấp chuyên môn và định hướng kiến trúc phần mềm.
        </p>
      </div>

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <!-- Profile Card & Bio Overview -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Left Avatar Sidebar -->
          <div class="lg:col-span-4 glass-panel p-6 border border-cyber-border/30 shadow-glass-card flex flex-col items-center text-center space-y-5">
            <div class="relative w-40 h-40 rounded-2xl overflow-hidden bg-slate-900 border-2 border-cyber-cyan/40 shadow-cyan-glow">
              <img
                v-if="about?.avatarUrl"
                :src="about.avatarUrl"
                :alt="about.name"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center text-cyber-cyan font-mono text-3xl font-bold"
              >
                HN
              </div>
            </div>

            <div>
              <h2 class="text-2xl font-bold text-white">{{ about?.name || 'Hồ Ngọc Thiện' }}</h2>
              <p class="text-sm font-mono text-cyber-cyan mt-1">{{ about?.title || 'Full Stack Software Engineer' }}</p>
            </div>

            <div v-if="publicSocialLinks.length" class="flex flex-wrap justify-center gap-2">
              <a
                v-for="link in publicSocialLinks"
                :key="link.label"
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 bg-white/5 border border-white/10 hover:text-cyber-cyan hover:border-cyber-cyan/40 transition-all"
              >
                {{ link.label }}
              </a>
            </div>

            <div v-if="about?.resumeUrl" class="w-full pt-2">
              <RouterLink to="/cv" class="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-indigo-500 text-slate-950 font-bold text-sm block hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all">
                Xem & Tải CV
              </RouterLink>
            </div>
          </div>

          <!-- Right Bio Narrative -->
          <div class="lg:col-span-8 glass-panel p-6 sm:p-8 border border-cyber-border/30 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 class="text-xl font-bold text-white">Giới Thiệu Tổng Quan</h2>
              <span class="text-xs font-mono text-slate-400">#BIO_OVERVIEW</span>
            </div>

            <p class="text-slate-300 text-base leading-relaxed">
              {{ about?.bio || 'Lập trình viên Full Stack nhiệt huyết với niềm đam mê xây dựng các sản phẩm công nghệ hiện đại, chất lượng cao, tối ưu cả về mặt giao diện lẫn hệ thống xử lý phía sau.' }}
            </p>
          </div>
        </div>

        <!-- Skills Matrix -->
        <div v-if="about?.skills?.length" class="glass-panel p-6 sm:p-8 border border-cyber-border/30 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 class="text-xl font-bold text-white">Ma Trận Kỹ Năng Kỹ Thuật</h2>
            <span class="text-xs font-mono text-slate-400">#CORE_SKILLS</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div
              v-for="skill in about.skills"
              :key="skill"
              class="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyber-cyan/40 hover:bg-cyber-cyan/10 transition-all font-mono text-xs text-slate-200 flex items-center gap-2"
            >
              <span class="w-2 h-2 rounded-full bg-cyber-cyan"></span>
              <span>{{ skill }}</span>
            </div>
          </div>
        </div>

        <!-- Experience Timeline -->
        <div v-if="about?.experience?.length" class="space-y-4">
          <div class="glass-panel p-6 border border-cyber-border/30 flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">Kinh Nghiệm Làm Việc</h2>
            <span class="text-xs font-mono text-slate-400">#EXPERIENCE</span>
          </div>

          <div class="space-y-4">
            <div
              v-for="(exp, i) in sortedExperiences"
              :key="i"
              class="glass-panel p-6 border border-cyber-border/30 hover:border-cyber-cyan/40 transition-all space-y-3"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                <div>
                  <h3 class="text-lg font-bold text-white">{{ exp.position }}</h3>
                  <span class="text-xs font-mono text-cyber-cyan">{{ exp.company }}</span>
                </div>
                <span class="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  {{ exp.startDate }} – {{ exp.endDate || 'Hiện tại' }}
                </span>
              </div>

              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="text-slate-300 text-sm leading-relaxed" v-html="sanitizeHtml(exp.description)" />
            </div>
          </div>
        </div>

        <!-- Education -->
        <div v-if="about?.education?.length" class="space-y-4">
          <div class="glass-panel p-6 border border-cyber-border/30 flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">Học Vấn & Đào Tạo</h2>
            <span class="text-xs font-mono text-slate-400">#EDUCATION</span>
          </div>

          <div class="space-y-4">
            <div
              v-for="(edu, i) in sortedEducation"
              :key="i"
              class="glass-panel p-6 border border-cyber-border/30 hover:border-indigo-500/40 transition-all space-y-2"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 class="text-lg font-bold text-white">{{ edu.degree }} {{ edu.field ? `in ${edu.field}` : '' }}</h3>
                  <span class="text-xs font-mono text-indigo-400">{{ edu.institution }}</span>
                </div>
                <span class="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  {{ edu.startDate }} – {{ edu.endDate || 'Hiện tại' }}
                </span>
              </div>
              <p v-if="edu.gpa" class="text-xs font-mono text-slate-300">GPA: {{ edu.gpa }}</p>
            </div>
          </div>
        </div>

        <!-- Licenses & Certifications -->
        <div v-if="licensesCertifications.length" class="space-y-4">
          <div class="glass-panel p-6 border border-cyber-border/30 flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">Chứng Chỉ & Bằng Cấp</h2>
            <span class="text-xs font-mono text-slate-400">#CERTIFICATIONS</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(item, i) in licensesCertifications"
              :key="`${item.name}-${item.issuer}-${i}`"
              class="glass-panel p-5 border border-cyber-border/30 hover:border-violet-500/40 transition-all space-y-2"
            >
              <h3 class="text-base font-bold text-white">{{ item.name }}</h3>
              <p v-if="item.issuer" class="text-xs font-mono text-violet-400">{{ item.issuer }}</p>
              <p v-if="item.issueDate || item.expirationDate" class="text-xs font-mono text-slate-400">
                {{ item.issueDate || 'N/A' }} – {{ item.expirationDate || 'Không thời hạn' }}
              </p>
              <a
                v-if="item.credentialUrl"
                :href="item.credentialUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block text-xs font-mono text-cyber-cyan hover:underline pt-1"
              >
                Xác minh chứng chỉ ↗
              </a>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAboutStore } from '@/stores/about'
import { useBlogStore } from '@/stores/blog'
import { useHomeStore } from '@/stores/home'
import { useProjectsStore } from '@/stores/projects'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { getPublicSocialLinks } from '@/utils/aboutPresentation'
import { sortExperiencesDescending } from '@/utils/experienceSort'
import { sanitizeRichContent } from '@/utils/richContent'
import { applySeo } from '@/utils/seo'
import { getAboutSeoMeta } from '@/utils/seoPriority'

const aboutStore = useAboutStore()
const homeStore = useHomeStore()
const projectsStore = useProjectsStore()
const blogStore = useBlogStore()
const loading = computed(() => aboutStore.loading)
const about = computed(() => aboutStore.aboutData)
const publicSocialLinks = computed(() => getPublicSocialLinks(about.value))
const sortedExperiences = computed(() => sortExperiencesDescending(about.value?.experience || []))
const sortedEducation = computed(() => sortExperiencesDescending(about.value?.education || []))
const licensesCertifications = computed(() => about.value?.licensesCertifications || [])

function sanitizeHtml(html: string): string {
  return sanitizeRichContent(html)
}

onMounted(async () => {
  await Promise.all([
    aboutStore.fetchAboutData(),
    homeStore.homeData ? Promise.resolve() : homeStore.fetchHomeData(),
    projectsStore.projects.length ? Promise.resolve() : projectsStore.fetchProjects(),
    blogStore.posts.length ? Promise.resolve() : blogStore.fetchPosts(),
  ])

  applySeo({
    ...getAboutSeoMeta({
      about: aboutStore.aboutData,
      home: homeStore.homeData,
      projects: projectsStore.projects,
      posts: blogStore.posts,
    }),
    url: '/about',
  })
})
</script>
