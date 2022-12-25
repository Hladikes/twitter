<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
  import { useUserStore } from './stores/user'
  import Router from '@/router'

  const user = useUserStore()

  async function logout() {
    await user.logout()
    Router.push({ name: 'login' })
  }
</script>

<template>
  <main>
    <template v-if="user.isInitialized">
      <header>
        <nav>
          <template v-if="!user.isLogged">
            <RouterLink to="/login">Login</RouterLink>
            <span>&nbsp;</span>
            <RouterLink to="/register">Register</RouterLink>
            <span>&nbsp;</span>
          </template>

          <template v-else>
            <RouterLink to="/users">Users</RouterLink>
          </template>
        </nav>
      </header>

      <hr>

      <div>
        <span>Logged: {{ user.isLogged }}</span><br>
        <pre>User: {{ user.current ?? 'none' }}</pre>
      </div>
      
      <hr>

      <RouterView />

      <template v-if="user.isLogged">
        <hr>
        <button @click="logout()">Logout</button>
      </template>
    </template>
  </main>
</template>

<style scoped>
  main {
    max-width: 600px;
    width: 100%;
    height: calc(100vh - 64px);
    margin: 32px auto;
    box-sizing: border-box;
    border: 1px solid gray;
    padding: 24px;
  }
</style>
