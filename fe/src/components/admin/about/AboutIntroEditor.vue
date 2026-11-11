<template>
  <div class="form-group">
    <label>Name</label>
    <input v-model="model.name" type="text" placeholder="Your name" />
  </div>
  <div class="form-group">
    <label>Title</label>
    <input v-model="model.title" type="text" placeholder="Full Stack Developer" />
  </div>
  <div class="form-group">
    <label>Bio / Architectural Summary</label>
    <textarea v-model="model.bio" rows="5" placeholder="Tell your story..." />
  </div>

  <h3 class="text-white font-semibold mb-4 mt-6">Availability &amp; Profile Telemetry</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-slate-900/50 border border-white/10">
    <div class="form-group mb-0">
      <label>Availability Badge Status</label>
      <input v-model="model.availabilityStatus" type="text" placeholder="Available for Architecture & Engineering" />
    </div>
    <div class="form-group mb-0">
      <label>Telemetry Location</label>
      <input v-model="model.telemetry.location" type="text" placeholder="Ho Chi Minh City, VN" />
    </div>
    <div class="form-group mb-0">
      <label>Telemetry Timezone</label>
      <input v-model="model.telemetry.timezone" type="text" placeholder="GMT+7 (Indochina)" />
    </div>
    <div class="form-group mb-0">
      <label>Telemetry Focus</label>
      <input v-model="model.telemetry.focus" type="text" placeholder="Distributed Systems & UI Architecture" />
    </div>
    <div class="form-group mb-0 md:col-span-2">
      <label>Telemetry Production Status</label>
      <input v-model="model.telemetry.status" type="text" placeholder="Production Active" />
    </div>
  </div>

  <h3 class="text-white font-semibold mb-4 mt-6">Architectural Pillars &amp; Core Tenets</h3>
  <div class="space-y-4 mb-6">
    <div
      v-for="(pillar, index) in model.pillars"
      :key="pillar._editorId"
      class="border border-white/10 rounded-xl p-4 bg-slate-900/40 space-y-3"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="form-group mb-0">
          <label>Pillar Tag</label>
          <input v-model="pillar.tag" type="text" placeholder="PILLAR 01 · ⚡ TYPE SAFETY" />
        </div>
        <div class="form-group mb-0">
          <label>Pillar Title</label>
          <input v-model="pillar.title" type="text" placeholder="Contract-First Systems" />
        </div>
      </div>
      <div class="form-group mb-0">
        <label>Description</label>
        <textarea v-model="pillar.description" rows="2" placeholder="Explain the core technical philosophy..." />
      </div>
      <div class="flex justify-end">
        <button
          type="button"
          class="btn btn--danger btn--sm"
          :disabled="model.pillars.length === 1"
          @click="removePillar(index)"
        >
          Remove Pillar
        </button>
      </div>
    </div>
  </div>
  <button type="button" class="btn btn--secondary mb-6" @click="addPillar">+ Add Architectural Pillar</button>

  <h3 class="text-white font-semibold mb-4 mt-2">Contact Info</h3>
  <div class="form-group">
    <label>Email</label>
    <input v-model="model.contactInfo.email" type="email" placeholder="you@email.com" />
  </div>
  <div class="form-group">
    <label>Phone</label>
    <input v-model="model.contactInfo.phone" type="text" placeholder="+84 ..." />
  </div>
  <div class="form-group">
    <label>Location</label>
    <input v-model="model.contactInfo.location" type="text" placeholder="Ho Chi Minh City, Vietnam" />
  </div>
  <div class="form-group">
    <label>Website</label>
    <input v-model="model.contactInfo.website" type="url" placeholder="https://yourdomain.com" />
  </div>
</template>

<script setup lang="ts">
import type { AboutIntroFormData } from './types'
import { createEmptyPillar } from './types'

const model = defineModel<AboutIntroFormData>({ required: true })

function addPillar(): void {
  model.value.pillars.push(createEmptyPillar())
}

function removePillar(index: number): void {
  if (model.value.pillars.length === 1) return
  model.value.pillars.splice(index, 1)
}
</script>
