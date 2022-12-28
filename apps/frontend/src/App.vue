<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import { useUserStore } from './stores/user'
  import Router from '@/router'

  const user = useUserStore()

  async function logout() {
    await user.logout()
    Router.push({ name: 'login' })
  }
</script>

<template>
  <main class="min-h-screen flex justify-center bg-stone-900">
    <template v-if="user.isInitialized">
      <div class="w-full lg:w-1/2 lg:my-20 lg:rounded-2xl bg-stone-800 sm:border border-white/5 overflow-hidden flex flex-col">
        <RouterView />
      </div>
    </template>
  </main>
</template>
