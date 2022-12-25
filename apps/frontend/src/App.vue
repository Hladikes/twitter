<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
  import { useUserStore } from './stores/user'

  const user = useUserStore()
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/login">Login</RouterLink>
      <span>&nbsp;</span>
      <RouterLink to="/register">Register</RouterLink>
      <span>&nbsp;</span>
      <RouterLink to="/users">Users</RouterLink>
    </nav>
  </header>

  <hr>
  <div>
    <span>Logged: {{ user.isLogged }}</span><br>
    <span>User: {{ user.current ?? 'none' }}</span>
  </div>
  <hr>

  <RouterView />
</template>

<style scoped></style>
