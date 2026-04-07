<template>
  <span class="skill-badge">{{ skill }}</span>
</template>

<script setup lang="ts">
defineProps<{
  skill: string
}>()
</script>
