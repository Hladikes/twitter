<script setup lang="ts">
  import type { useError } from '@/plugins/hooks/error'

  const props = defineProps<{
    error: ReturnType<typeof useError>
  }>()
</script>

<template>
  <div class="bg-red-500/5 border border-red-500/20 rounded-md px-3 py-2 flex flex-row" v-if="props.error.visible.value">
    <p class="py-1 break-words text-red-200 text-base flex-1">{{ props.error.message.value }}</p>
    <button class="self-end text-red-400 text-base uppercase font-bold px-2 py-1 hover:text-white" @click="props.error.hide()">ok</button>
  </div>
</template>