<template>
  <h3 class="text-white font-semibold mb-4 mt-2">Social Links</h3>
  <div class="space-y-4 mb-5">
    <div
      v-for="(link, index) in model"
      :key="link._editorId"
      class="border border-white/10 rounded-xl p-4 bg-slate-900/40"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="form-group mb-0">
          <label>Label</label>
          <input v-model="link.label" type="text" placeholder="GitHub, LinkedIn, Portfolio..." />
        </div>
        <div class="form-group mb-0">
          <label>URL</label>
          <input v-model="link.url" type="text" placeholder="https://..." />
        </div>
      </div>

      <div class="mt-3 flex justify-end">
        <button
          type="button"
          class="btn btn--danger btn--sm"
          :disabled="model.length === 1"
          @click="removeSocialLink(index)"
        >
          Remove Link
        </button>
      </div>
    </div>
  </div>

  <button type="button" class="btn btn--secondary mb-5" @click="addSocialLink">+ Add Social Link</button>
</template>

<script setup lang="ts">
import type { SocialLinkForm } from './types'
import { createEmptySocialLink } from './types'

const model = defineModel<SocialLinkForm[]>({ required: true })

function addSocialLink(): void {
  model.value.push(createEmptySocialLink())
}

function removeSocialLink(index: number): void {
  if (model.value.length === 1) return
  model.value.splice(index, 1)
}
</script>
