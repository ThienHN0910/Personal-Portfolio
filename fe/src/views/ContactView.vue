<template>
  <div class="min-h-[100dvh] bg-canvas">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      <!-- Header -->
      <div class="editorial-card">
        <div class="editorial-card__inner p-8 sm:p-12 flex flex-col justify-between gap-6">
          <div class="flex items-center justify-between gap-3">
            <span class="eyebrow-tag">
              <span class="status-dot"></span>
              Inquiries &amp; Collaboration
            </span>
            <span class="hidden sm:block font-mono text-[10px] text-ink-tertiary uppercase tracking-widest">
              Direct Contact
            </span>
          </div>

          <div class="space-y-3 max-w-2xl">
            <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.03em] leading-[1.05] text-ink">
              Let's connect
              <span class="block italic text-ink-secondary mt-1">&amp; engineer together.</span>
            </h1>
            <p class="text-base text-ink-secondary leading-relaxed font-sans font-light">
              Have an engineering opportunity, software architecture consultation, or product build in mind? Send a direct message below.
            </p>
          </div>
        </div>
      </div>

      <!-- Contact Form & Info Grid -->
      <div class="editorial-card">
        <div class="editorial-card__inner p-6 sm:p-10 space-y-8">
          <form class="space-y-5" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- Name Input -->
              <div class="space-y-1.5">
                <label for="name" class="block text-[11px] font-mono text-ink-secondary uppercase tracking-wider">Full Name *</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  placeholder="Your full name"
                  required
                  class="w-full px-4 py-2.5 rounded-lg bg-bone border border-stroke text-ink placeholder-ink-tertiary font-sans text-sm focus:outline-none focus:border-ink/30 transition-all"
                />
              </div>

              <!-- Email Input -->
              <div class="space-y-1.5">
                <label for="email" class="block text-[11px] font-mono text-ink-secondary uppercase tracking-wider">Email Address *</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  class="w-full px-4 py-2.5 rounded-lg bg-bone border border-stroke text-ink placeholder-ink-tertiary font-sans text-sm focus:outline-none focus:border-ink/30 transition-all"
                />
              </div>
            </div>

            <!-- Subject Input -->
            <div class="space-y-1.5">
              <label for="subject" class="block text-[11px] font-mono text-ink-secondary uppercase tracking-wider">Subject *</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                placeholder="Project inquiry / Opportunity"
                required
                class="w-full px-4 py-2.5 rounded-lg bg-bone border border-stroke text-ink placeholder-ink-tertiary font-sans text-sm focus:outline-none focus:border-ink/30 transition-all"
              />
            </div>

            <!-- Message Textarea -->
            <div class="space-y-1.5">
              <label for="message" class="block text-[11px] font-mono text-ink-secondary uppercase tracking-wider">Message *</label>
              <textarea
                id="message"
                v-model="form.message"
                rows="6"
                maxlength="2000"
                placeholder="Details of your inquiry or technical project..."
                required
                class="w-full px-4 py-3 rounded-lg bg-bone border border-stroke text-ink placeholder-ink-tertiary font-sans text-sm focus:outline-none focus:border-ink/30 transition-all resize-y"
              />
            </div>

            <!-- Cloudflare Turnstile Container -->
            <div id="turnstile-container" class="min-h-[65px] flex items-center justify-center pt-2"></div>

            <!-- Error Alert -->
            <div v-if="contactStore.error" class="p-4 rounded-md bg-pastel-red border border-pastel-red-text/20 text-pastel-red-text text-xs font-mono">
              {{ contactStore.error }}
            </div>

            <!-- Success Alert -->
            <div v-if="contactStore.success" class="p-4 rounded-md bg-pastel-green border border-pastel-green-text/20 text-pastel-green-text text-xs font-mono flex items-center gap-2">
              <span class="text-sm">✓</span>
              <span>Your message has been sent successfully. I will get back to you shortly.</span>
            </div>

            <!-- Submit Button (Button in button) -->
            <button
              type="submit"
              class="group w-full py-3 px-6 rounded-md bg-ink text-surface font-sans font-medium text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-transform duration-200 disabled:opacity-50"
              :disabled="contactStore.loading"
            >
              <span>{{ contactStore.loading ? 'Sending message...' : 'Send Message' }}</span>
              <span class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform duration-200">
                <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                </svg>
              </span>
            </button>
          </form>
        </div>
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
    contactStore.error = 'Please complete the CAPTCHA verification to submit the form'
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
          contactStore.error = 'CAPTCHA error. Please refresh the page and try again.'
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
