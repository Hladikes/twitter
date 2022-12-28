<script setup lang="ts">
  import { useUserStore } from '@/stores/user'
  import { useError } from '@/plugins/hooks/error'
  import Error from '@/components/Error.vue'
  import Router from '@/router'
  import { RouterLink } from 'vue-router'

  const user = useUserStore()
  const error = useError()

  function formSubmit(event: Event) {
    if (!event.target) {
      return
    }

    const formData = new FormData(event.target as HTMLFormElement)
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))

    user.login({ email, password })
      .then(() => {
        (event.target as HTMLFormElement).reset()
        error.hide()
        Router.push({ name: 'tweets' })
      })
      .catch((err: string[]) => {
        error.show(err.join('\n'))
      })
  }
</script>

<template>
  <div class="flex-1 flex items-center justify-center">
    <div class="w-full sm:w-1/2 p-5 sm:border flex flex-col border-white/10 space-y-2 rounded-xl">
      <h1 class="text-white text-5xl block mb-3">Login</h1>

      <Error :error="error" />
      
      <form @submit.prevent="formSubmit" class="flex flex-col space-y-2">
        <input 
          class="px-3 py-2 bg-white/5 placeholder-white/50 text-white text-lg rounded-md focus:outline-none focus:bg-white/10" 
          name="email" 
          type="text" 
          placeholder="Email">
        <input 
          class="px-3 py-2 bg-white/5 placeholder-white/50 text-white text-lg rounded-md focus:outline-none focus:bg-white/10" 
          name="password" 
          type="password" 
          placeholder="Password">
        <div class="flex flex-row items-center justify-end space-x-3">
          <RouterLink 
            class="p-2 text-white hover:underline"
            :to="{ name: 'register' }">Register</RouterLink>
          <button 
            class="px-5 py-2 bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 font-medium rounded-md" 
            type="submit">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>
