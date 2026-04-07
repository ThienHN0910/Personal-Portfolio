<template>
  <div class="admin-header">
    <div>
      <p class="admin-kicker mb-1">{{ kicker }}</p>
      <h1 class="section-title mb-0">
        {{ titleBefore }}
        <span class="highlight">{{ titleHighlight }}</span>
      </h1>
    </div>
    <div v-if="$slots.actions" class="flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  kicker: string
  titleBefore: string
  titleHighlight: string
}>()
</script>
