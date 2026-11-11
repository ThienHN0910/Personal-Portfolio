<template>
  <h3 class="text-white font-semibold mb-4 mt-2">Licenses &amp; Certifications</h3>
  <div class="space-y-5 mb-5">
    <div
      v-for="(item, index) in model"
      :key="item._editorId"
      class="border border-white/10 rounded-xl p-4 bg-slate-900/40"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="form-group mb-0">
          <label>Name</label>
          <input v-model="item.name" type="text" placeholder="AWS Certified Developer" />
        </div>
        <div class="form-group mb-0">
          <label>Issuer</label>
          <input v-model="item.issuer" type="text" placeholder="Amazon Web Services" />
        </div>
        <div class="form-group mb-0">
          <label>Issue Date</label>
          <input v-model="item.issueDate" type="text" placeholder="Jan 2025" />
        </div>
        <div class="form-group mb-0">
          <label>Expiration Date</label>
          <input v-model="item.expirationDate" type="text" placeholder="Jan 2028" />
        </div>
        <div class="form-group mb-0">
          <label>Credential ID</label>
          <input v-model="item.credentialId" type="text" placeholder="ABC-12345" />
        </div>
        <div class="form-group mb-0">
          <label>Credential URL</label>
          <input v-model="item.credentialUrl" type="text" placeholder="https://verify.example.com/..." />
        </div>
      </div>

      <div class="mt-3 flex justify-end">
        <button
          type="button"
          class="btn btn--danger btn--sm"
          :disabled="model.length === 1"
          @click="removeLicenseCertification(index)"
        >
          Remove Item
        </button>
      </div>
    </div>
  </div>

  <button type="button" class="btn btn--secondary mb-5" @click="addLicenseCertification">+ Add License/Certification</button>
</template>

<script setup lang="ts">
import type { LicenseCertificationForm } from './types'
import { createEmptyLicenseCertification } from './types'

const model = defineModel<LicenseCertificationForm[]>({ required: true })

function addLicenseCertification(): void {
  model.value.push(createEmptyLicenseCertification())
}

function removeLicenseCertification(index: number): void {
  if (model.value.length === 1) return
  model.value.splice(index, 1)
}
</script>
