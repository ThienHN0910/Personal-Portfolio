<template>
  <h3 class="text-white font-semibold mb-4 mt-2">Education</h3>
  <div class="space-y-5 mb-5">
    <div
      v-for="(edu, index) in model"
      :key="edu._editorId"
      class="border border-white/10 rounded-xl p-4 bg-slate-900/40"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="form-group mb-0">
          <label>Institution</label>
          <input v-model="edu.institution" type="text" placeholder="University / Academy" />
        </div>
        <div class="form-group mb-0">
          <label>Degree</label>
          <input v-model="edu.degree" type="text" placeholder="Bachelor / Master / Diploma" />
        </div>
        <div class="form-group mb-0">
          <label>Field</label>
          <input v-model="edu.field" type="text" placeholder="Computer Science" />
        </div>
        <div class="form-group mb-0">
          <label>GPA</label>
          <input v-model="edu.gpa" type="text" placeholder="3.75/4.0" />
        </div>
        <div class="form-group mb-0">
          <label>Start Date</label>
          <input v-model="edu.startDate" type="text" placeholder="Sep 2018" />
        </div>
        <div class="form-group mb-0">
          <label>End Date</label>
          <input v-model="edu.endDate" type="text" placeholder="Jun 2022" />
        </div>
      </div>

      <div class="mt-3 flex justify-end">
        <button
          type="button"
          class="btn btn--danger btn--sm"
          :disabled="model.length === 1"
          @click="removeEducation(index)"
        >
          Remove Education
        </button>
      </div>
    </div>
  </div>

  <button type="button" class="btn btn--secondary mb-5" @click="addEducation">+ Add Education</button>
</template>

<script setup lang="ts">
import type { EducationForm } from './types'
import { createEmptyEducation } from './types'

const model = defineModel<EducationForm[]>({ required: true })

function addEducation(): void {
  model.value.push(createEmptyEducation())
}

function removeEducation(index: number): void {
  if (model.value.length === 1) return
  model.value.splice(index, 1)
}
</script>
