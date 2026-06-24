<template>
  <div class="section min-h-screen pt-24">
    <div class="container">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="section-title">Get In <span class="highlight">Touch</span></h1>
          <p class="section-subtitle mx-auto">Have a project in mind or want to collaborate? Send me a message.</p>
        </div>

        <div class="glass-panel cut-corners p-6">
          <form @submit.prevent="handleSubmit" class="font-mono">
            <div class="form-group">
              <label for="name">Name</label>
              <input id="name" v-model="form.name" type="text" placeholder="Your name" required class="bg-transparent border border-white/8 py-2 px-3" />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" v-model="form.email" type="email" placeholder="your@email.com" required class="bg-transparent border border-white/8 py-2 px-3" />
            </div>

            <div class="form-group">
              <label for="subject">Subject</label>
              <input id="subject" v-model="form.subject" type="text" placeholder="What's this about?" required class="bg-transparent border border-white/8 py-2 px-3" />
            </div>

            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" v-model="form.message" rows="6" maxlength="2000" placeholder="Tell me about your project..." required class="bg-transparent border border-white/8 py-2 px-3 font-mono" />
            </div>

            <div id="turnstile-container" class="mt-4 mb-4 min-h-[65px]"></div>

            <div v-if="contactStore.error" class="text-red-400 text-sm mb-4">
              {{ contactStore.error }}
            </div>

            <div v-if="contactStore.success" class="text-green-400 text-sm mb-4 bg-green-400/10 border border-green-400/20 rounded-lg p-3">
              Ã¢Å“â€œ Message sent! I'll get back to you soon.
            </div>

            <button type="submit" class="btn btn--primary w-full font-os" :disabled="contactStore.loading">
              <span v-if="contactStore.loading">ESTABLISHING...</span>
              <span v-else>Send Message</span>
            </button>
          </form>

          <div class="mt-6"><div class="w-full h-40 bg-white/3 border border-white/6 rounded"></div></div>
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
    contactStore.error = 'Vui lòng xác nhận CAPTCHA'
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
          contactStore.error = 'CAPTCHA error. Please refresh and try again.'
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
