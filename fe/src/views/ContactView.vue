<template>
  <div class="min-h-screen pt-6 pb-16 relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.08),transparent_40%)]" />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
      <!-- Header -->
      <div class="glass-panel p-6 sm:p-10 border border-cyber-border/40 shadow-cyan-glow text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs mb-3">
          <span>KẾT NỐI & HỢP TÁC</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Liên Hệ Với <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-indigo-400">Hồ Ngọc Thiện</span>
        </h1>
        <p class="mt-3 text-slate-300 text-base max-w-xl mx-auto leading-relaxed">
          Bạn có dự án mới, ý tưởng cần tư vấn hoặc cơ hội nghề nghiệp? Hãy gửi tin nhắn trực tiếp qua biểu mẫu bên dưới.
        </p>
      </div>

      <!-- Contact Form & Info Grid -->
      <div class="glass-panel p-6 sm:p-10 border border-cyber-border/30 shadow-glass-card">
        <form class="space-y-5" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <!-- Name Input -->
            <div class="space-y-1.5">
              <label for="name" class="block text-xs font-mono text-slate-300 uppercase">Họ và tên *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Nhập họ và tên của bạn"
                required
                class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/50 transition-all"
              />
            </div>

            <!-- Email Input -->
            <div class="space-y-1.5">
              <label for="email" class="block text-xs font-mono text-slate-300 uppercase">Địa chỉ Email *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="email@domain.com"
                required
                class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/50 transition-all"
              />
            </div>
          </div>

          <!-- Subject Input -->
          <div class="space-y-1.5">
            <label for="subject" class="block text-xs font-mono text-slate-300 uppercase">Tiêu đề tin nhắn *</label>
            <input
              id="subject"
              v-model="form.subject"
              type="text"
              placeholder="Chủ đề công việc / dự án"
              required
              class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/50 transition-all"
            />
          </div>

          <!-- Message Textarea -->
          <div class="space-y-1.5">
            <label for="message" class="block text-xs font-mono text-slate-300 uppercase">Nội dung tin nhắn *</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="6"
              maxlength="2000"
              placeholder="Mô tả chi tiết nội dung cần trao đổi..."
              required
              class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/50 transition-all"
            />
          </div>

          <!-- Cloudflare Turnstile Container -->
          <div id="turnstile-container" class="min-h-[65px] flex items-center justify-center pt-2"></div>

          <!-- Error Alert -->
          <div v-if="contactStore.error" class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-mono">
            {{ contactStore.error }}
          </div>

          <!-- Success Alert -->
          <div v-if="contactStore.success" class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-mono flex items-center gap-2">
            <span class="text-base">✓</span>
            <span>Tin nhắn đã được gửi thành công! Tôi sẽ phản hồi sớm nhất có thể.</span>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyber-cyan via-indigo-500 to-violet-500 text-slate-950 font-bold text-sm font-mono uppercase tracking-wider hover:shadow-[0_0_25px_rgba(0,242,255,0.4)] transition-all disabled:opacity-50"
            :disabled="contactStore.loading"
          >
            <span v-if="contactStore.loading">ĐANG GỬI TIN NHẮN...</span>
            <span v-else>Gửi Tin Nhắn Phản Hồi</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useAboutStore } from '@/stores/about'
import { useHomeStore } from '@/stores/home'
import { useContactStore } from '@/stores/contact'
import { applySeo } from '@/utils/seo'
import { getContactSeoMeta } from '@/utils/seoPriority'

const contactStore = useContactStore()
const aboutStore = useAboutStore()
const homeStore = useHomeStore()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const turnstileToken = ref<string>('')
const turnstileWidgetId = ref<string | null>(null)

async function handleSubmit() {
  if (!turnstileToken.value) {
    contactStore.error = 'Vui lòng xác nhận CAPTCHA để gửi tin nhắn'
    return
  }

  await contactStore.sendMessage({
    ...form,
    cfTurnstileResponse: turnstileToken.value
  })

  if (contactStore.success) {
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  }

  if ((window as any).turnstile && turnstileWidgetId.value !== null) {
    (window as any).turnstile.reset(turnstileWidgetId.value)
    turnstileToken.value = ''
  }
}

onMounted(async () => {
  await Promise.all([
    aboutStore.aboutData ? Promise.resolve() : aboutStore.fetchAboutData(),
    homeStore.homeData ? Promise.resolve() : homeStore.fetchHomeData(),
  ])

  applySeo({
    ...getContactSeoMeta({
      about: aboutStore.aboutData,
      home: homeStore.homeData,
    }),
    url: '/contact',
  })

  const initTurnstile = () => {
    if ((window as any).turnstile) {
      const widgetId = (window as any).turnstile.render('#turnstile-container', {
        sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
        callback: (token: string) => {
          turnstileToken.value = token
          contactStore.error = null
        },
        'error-callback': () => {
          contactStore.error = 'Lỗi CAPTCHA. Vui lòng làm mới trang và thử lại.'
        }
      })
      turnstileWidgetId.value = widgetId
    }
  }

  if ((window as any).turnstile) {
    initTurnstile()
  } else {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = () => {
      initTurnstile()
    }
    document.head.appendChild(script)
  }
})
</script>
