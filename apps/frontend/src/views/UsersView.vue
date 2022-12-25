<script setup lang="ts">
  import { useError } from '@/plugins/hooks/error'
  import type { User } from '@/stores/user'
  import { useUserStore } from '@/stores/user'
  import { onMounted, ref } from 'vue'

  const error = useError()
  const user = useUserStore()
  const users = ref<User[]>([])

  onMounted(() => {
    user.getAllUsers()
      .then((allUsers) => {
        users.value = allUsers
      })
      .catch((err: string[]) => {
        users.value = []
        error.show(err.join('\n'))
      })
  })
</script>

<template>
  <h1>All users</h1>

  <div v-if="error.visible.value">
    <p style="white-space: pre-line;">
      <b>{{ error.message.value }}</b>
      <button @click="error.hide()">ok</button>
    </p>
  </div>

  <div>
    <div v-for="user in users" :key="user.id">
      <span>{{ user.username }}</span><br>
      <span>{{ user.email }}</span><br>
      <span>-</span><br>
    </div>
  </div>
</template>