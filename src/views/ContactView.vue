<template>
  <div class="section min-h-screen pt-24">
    <div class="container">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="section-title">Get In <span class="highlight">Touch</span></h1>
          <p class="section-subtitle mx-auto">Have a project in mind or want to collaborate? Send me a message.</p>
        </div>

        <div class="card p-8">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">Name</label>
              <input id="name" v-model="form.name" type="text" placeholder="Your name" required />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" v-model="form.email" type="email" placeholder="your@email.com" required />
            </div>

            <div class="form-group">
              <label for="subject">Subject</label>
              <input id="subject" v-model="form.subject" type="text" placeholder="What's this about?" required />
            </div>

            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" v-model="form.message" rows="6" placeholder="Tell me about your project..." required />
            </div>

            <div v-if="contactStore.error" class="text-red-400 text-sm mb-4">
              {{ contactStore.error }}
            </div>

            <div v-if="contactStore.success" class="text-green-400 text-sm mb-4 bg-green-400/10 border border-green-400/20 rounded-lg p-3">
              ✓ Message sent! I'll get back to you soon.
            </div>

            <button type="submit" class="btn btn--primary w-full" :disabled="contactStore.loading">
              <span v-if="contactStore.loading">Sending...</span>
              <span v-else>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useContactStore } from '@/stores/contact'

const contactStore = useContactStore()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

async function handleSubmit() {
  await contactStore.sendMessage({ ...form })
  if (contactStore.success) {
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  }
}
</script>
