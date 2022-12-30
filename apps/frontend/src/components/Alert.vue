<script setup lang="ts">
  import type { useAlert } from '@/plugins/hooks/alert'

  const props = defineProps<{
    alert: ReturnType<typeof useAlert>
  }>()
</script>

<template>
  <div 
    :class="{
      'bg-red-500/5 border border-red-500/20': alert.isError.value,
      'bg-green-500/5 border border-green-500/20': !alert.isError.value,
    }"
    class=" rounded-md px-3 py-2 flex flex-row" v-if="props.alert.visible.value">
    <p 
      :class="{
        'text-red-200': alert.isError.value,
        'text-green-200': !alert.isError.value,
      }"
      class="py-1 break-words text-base flex-1">{{ props.alert.message.value }}</p>
    <button 
      :class="{
        'text-red-400': alert.isError.value,
        'text-green-400': !alert.isError.value,
      }"
      class="self-end text-base uppercase font-bold px-2 py-1 hover:text-white" @click="props.alert.hide()">ok</button>
  </div>
</template>