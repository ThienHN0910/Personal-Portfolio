<template>
  <div class="editor-skeleton" role="status" aria-live="polite">
    <div class="editor-skeleton__toolbar">
      <span v-for="item in 7" :key="`tool-${item}`" class="editor-skeleton__chip" />
    </div>
    <div class="editor-skeleton__body">
      <span v-for="line in 5" :key="`line-${line}`" class="editor-skeleton__line" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.editor-skeleton {
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 0.75rem;
  overflow: hidden;
}

.editor-skeleton__toolbar {
  display: flex;
  gap: 0.5rem;
  padding: 0.55rem 0.65rem;
  background: rgba(148, 163, 184, 0.14);
}

.editor-skeleton__chip,
.editor-skeleton__line {
  display: block;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.2), rgba(226, 232, 240, 0.35), rgba(148, 163, 184, 0.2));
  background-size: 200% 100%;
  animation: loading-shimmer 1.4s linear infinite;
}

.editor-skeleton__chip {
  width: 2.5rem;
  height: 1.25rem;
}

.editor-skeleton__body {
  padding: 0.9rem;
}

.editor-skeleton__line {
  height: 0.8rem;
  margin-bottom: 0.7rem;
}

.editor-skeleton__line:nth-child(1) {
  width: 88%;
}

.editor-skeleton__line:nth-child(2) {
  width: 96%;
}

.editor-skeleton__line:nth-child(3) {
  width: 84%;
}

.editor-skeleton__line:nth-child(4) {
  width: 92%;
}

.editor-skeleton__line:nth-child(5) {
  width: 76%;
  margin-bottom: 0;
}

@keyframes loading-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
