<template>
  <div
    v-if="cursorState.isVisible"
    class="custom-cursor-layer pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none"
    aria-hidden="true"
  >
    <!-- Fluid Outer Follower Circle / Interactive Pill -->
    <div
      class="custom-cursor-follower"
      :class="[
        `custom-cursor-follower--${cursorState.mode}`,
        { 'is-expanded': !!cursorState.label }
      ]"
      :style="followerStyle"
    >
      <span
        v-if="cursorState.label"
        class="custom-cursor-label text-[10.5px] font-mono uppercase tracking-widest text-surface font-bold animate-fade-in"
      >
        {{ cursorState.label }}
      </span>
    </div>

    <!-- Precision Center Dot -->
    <div
      v-if="!cursorState.label && (cursorState.mode === 'default' || cursorState.mode === 'pointer')"
      class="custom-cursor-dot"
      :class="{ 'is-hovering': cursorState.mode === 'pointer' }"
      :style="dotStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useCustomCursor } from '@/composables/useCustomCursor'

const { cursorState, initCursor } = useCustomCursor()
let cleanup: (() => void) | undefined

const dotStyle = computed(() => ({
  transform: `translate3d(${cursorState.value.targetX}px, ${cursorState.value.targetY}px, 0)`,
}))

const followerStyle = computed(() => ({
  transform: `translate3d(${cursorState.value.x}px, ${cursorState.value.y}px, 0)`,
}))

onMounted(() => {
  cleanup = initCursor()
})

onUnmounted(() => {
  if (cleanup) cleanup()
})
</script>

<style scoped lang="scss">
.custom-cursor-layer {
  contain: layout style paint;
}

.custom-cursor-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  margin-top: -3px;
  margin-left: -3px;
  border-radius: 50%;
  background-color: var(--ink);
  pointer-events: none;
  transition: transform 0.05s linear, width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
  will-change: transform;

  &.is-hovering {
    opacity: 0.2;
    transform: translate3d(var(--target-x), var(--target-y), 0) scale(1.5);
  }
}

.custom-cursor-follower {
  position: absolute;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  margin-top: -18px;
  margin-left: -18px;
  border-radius: 50%;
  border: 1px solid var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              height 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              margin 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.08s linear;
  will-change: transform;
  backdrop-filter: blur(2px);

  &--pointer {
    width: 50px;
    height: 50px;
    margin-top: -25px;
    margin-left: -25px;
    background-color: rgba(var(--ink-rgb), 0.08);
    border-color: rgba(var(--ink-rgb), 0.3);
  }

  &.is-expanded {
    width: 78px;
    height: 78px;
    margin-top: -39px;
    margin-left: -39px;
    background-color: var(--ink);
    border-color: var(--ink);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@media (hover: none) and (pointer: coarse) {
  .custom-cursor-layer {
    display: none !important;
  }
}
</style>
