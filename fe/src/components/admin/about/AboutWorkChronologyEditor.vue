<template>
  <h3 class="text-white font-semibold mb-4 mt-2">Experience</h3>
  <div class="space-y-5 mb-5">
    <div
      v-for="(exp, index) in model"
      :key="exp._editorId"
      class="border border-white/10 rounded-xl p-4 bg-slate-900/40"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div class="form-group mb-0">
          <label>Company</label>
          <input v-model="exp.company" type="text" placeholder="Company" />
        </div>
        <div class="form-group mb-0">
          <label>Position</label>
          <input v-model="exp.position" type="text" placeholder="Position" />
        </div>
        <div class="form-group mb-0">
          <label>Start Date</label>
          <input v-model="exp.startDate" type="text" placeholder="Jan 2022" />
        </div>
        <div class="form-group mb-0">
          <label>End Date</label>
          <input v-model="exp.endDate" type="text" placeholder="Present" />
        </div>
      </div>

      <div class="form-group mb-0">
        <label>Description</label>
        <FullRichEditor v-model="exp.description" :editor-key="exp._editorId" />
      </div>

      <div class="mt-3 flex justify-end">
        <button
          type="button"
          class="btn btn--danger btn--sm"
          :disabled="model.length === 1"
          @click="removeExperience(index)"
        >
          Remove Experience
        </button>
      </div>
    </div>
  </div>

  <button type="button" class="btn btn--secondary mb-5" @click="addExperience">+ Add Experience</button>
</template>

<script setup lang="ts">
import FullRichEditor from '@/components/admin/FullRichEditor.vue'
import type { ExperienceForm } from './types'
import { createEmptyExperience } from './types'

const model = defineModel<ExperienceForm[]>({ required: true })

function addExperience(): void {
  model.value.push(createEmptyExperience())
}

function removeExperience(index: number): void {
  if (model.value.length === 1) return
  model.value.splice(index, 1)
}
</script>
