<script setup lang="ts">
  import { useUserStore } from '@/stores/user'
  import { useError } from '@/plugins/hooks/error'

  const user = useUserStore()
  const error = useError()

  function formSubmit(event: Event) {
    error.hide()

    if (!event.target) {
      return
    }

    const formData = new FormData(event.target as HTMLFormElement)
    const email = String(formData.get('email'))
    const username = String(formData.get('username'))
    const password = String(formData.get('password'))

    user.register({ email, username, password })
      .then(() => {
        (event.target as HTMLFormElement).reset()
      })
      .catch((err: string[]) => {
        error.show(err[0])
      })
  }
</script>

<template>
  <h1>Register</h1>

  <div v-if="error.visible.value">
    <p style="white-space: pre-line;">
      <b>{{ error.message.value }}</b>
      <button @click="error.hide()">ok</button>
    </p>
  </div>

  <form @submit.prevent="formSubmit">
    <input name="email" type="text" placeholder="E-mail"><br>
    <input name="username" type="text" placeholder="Username"><br>
    <input name="password" type="text" placeholder="Password"><br>
    <button type="submit">Login</button>
  </form>
</template>

<style scoped></style>
