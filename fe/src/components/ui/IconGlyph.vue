<template>
  <svg :width="size" :height="size" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" :d="iconPath" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type IconName = 'add' | 'edit' | 'trash' | 'projects' | 'blog' | 'messages' | 'featured'

const props = withDefaults(
  defineProps<{
    name: IconName
    size?: number
  }>(),
  {
    size: 14,
  },
)

const ICON_PATHS: Record<IconName, string> = {
  add: 'M12 4.5v15m7.5-7.5h-15',
  edit: 'm16.862 4.487 2.651 2.651m-1.757-3.545a2.25 2.25 0 1 1 3.182 3.182L7.5 20.25 3 21l.75-4.5L17.256 3.594Z',
  trash:
    'm14.74 9-.347 9m-4.786 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673A2.25 2.25 0 0 1 15.916 21.75H8.084a2.25 2.25 0 0 1-2.245-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0V4.875c0-1.089-.84-1.985-1.922-1.995a51.964 51.964 0 0 0-3.656 0C9.09 2.89 8.25 3.786 8.25 4.875V5.39m7.5 0a48.667 48.667 0 0 0-7.5 0',
  projects: 'M3 7.5h18M6.75 3h10.5A2.25 2.25 0 0 1 19.5 5.25v13.5A2.25 2.25 0 0 1 17.25 21H6.75A2.25 2.25 0 0 1 4.5 18.75V5.25A2.25 2.25 0 0 1 6.75 3Z',
  blog: 'm4.5 6.75 7.5 4.5 7.5-4.5v10.5l-7.5 4.5-7.5-4.5V6.75Z',
  messages: 'M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25Zm0 0L12 13.5 2.25 6.75',
  featured: 'm9 12.75 2.25 2.25L15 9.75m6 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
}

const iconPath = computed(() => ICON_PATHS[props.name])
</script>
