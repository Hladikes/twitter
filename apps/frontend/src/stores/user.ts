import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { trpc } from '@/plugins/trpc'

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
    const loggedUser = await trpc.user.login.mutate(userObj)
    
    if (loggedUser) {
      user.value = loggedUser
      isLogged.value = true
      return
    }

    user.value.id = -1
    user.value.username = ''
    user.value.email = ''
    isLogged.value = false

    throw 'Bruh'
  }

  return {
    isLogged,
    current: computed(() => isLogged.value ? user : null),
    register,
    login,
  }
})

