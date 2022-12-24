import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { trpc } from '@/plugins/trpc'
import type { AppRouter } from 'backend/trpc'
import type { TRPCClientError } from '@trpc/client'

type User = {
  id: number
  username: string
  email: string
}

export const useUserStore = defineStore('counter', () => {
  const isLogged = ref(false)
  const user = ref<User>({
    id: -1,
    username: '',
    email: '',
  })

  function register(userObj: { email: string, username: string, password: string }) {
    return trpc.user.register.mutate(userObj)
  }

  async function login(userObj: { username: string, password: string }) {
    try {
      const loggedUser = await trpc.user.login.mutate(userObj)
    
      user.value = loggedUser
    
      isLogged.value = true
    } catch (err) {
      user.value.id = -1
      user.value.username = ''
      user.value.email = ''
  
      isLogged.value = false

      throw new Error('User not found')
    }
  }

  return {
    isLogged,
    current: computed(() => isLogged.value ? user : null),
    register,
    login,
  }
})

