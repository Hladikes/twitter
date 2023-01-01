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
  <main class="min-h-screen flex justify-center bg-secondary">
    <template v-if="user.isInitialized">
      <div class="w-full lg:w-1/2 lg:my-20 lg:rounded-2xl bg-primary sm:border border-white/10 overflow-hidden flex flex-col">
        <RouterView />
      </div>
    </template>
  </main>
</template>
