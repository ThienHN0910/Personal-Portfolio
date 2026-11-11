<template>
  <div class="form-group">
    <label>Skills (comma separated)</label>
    <input v-model="model" type="text" placeholder="Vue, TypeScript, Node.js, MongoDB" />
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>({ required: true })
</script>
