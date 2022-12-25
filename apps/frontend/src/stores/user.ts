import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getErrorMessage, trpc } from '@/plugins/trpc'

export type User = {
  id: number
  username: string
  email: string
}

export const useUserStore = defineStore('counter', () => {
  const isInitialized = ref(false)
  const isLogged = ref(false)
  const user = ref<User>({
    id: -1,
    username: '',
    email: '',
  })

  function reset() {
    user.value.id = -1
    user.value.username = ''
    user.value.email = ''

    isLogged.value = false
  }

  function register(userObj: { email: string, username: string, password: string }) {
    return new Promise<void>((resolve, reject) => {
      trpc.user.register.mutate(userObj)
        .then(resolve)
        .catch((err) => reject(getErrorMessage(err)))
    })
  }

  function logout() {
    reset()
    return new Promise((resolve) => {
      trpc.user.logout.query().then(resolve).catch(resolve)
    })
  }

  function login(userObj: { username: string, password: string }) {
    return new Promise<void>((resolve, reject) => {
      trpc.user.login.mutate(userObj)
        .then((loggedUser) => {
          isInitialized.value = true
          user.value = loggedUser
          isLogged.value = true

          resolve()
        })
        .catch((err) => {
          isInitialized.value = true

          reset()
          reject(getErrorMessage(err))
        })
    })
  }

  function getAllUsers() {
    return new Promise<User[]>((resolve, reject) => {
      trpc.user.getAllUsers.query()
        .then(resolve)
        .catch((err) => reject(getErrorMessage(err)))
    })
  }

  function checkSession() {
    return new Promise<boolean>((resolve) => {
      trpc.user.checkSession.query()
        .then((loggedUser) => {
          isInitialized.value = true
          user.value = loggedUser
          isLogged.value = true
          
          resolve(true)
        })
        .catch(() => {
          isInitialized.value = true
          
          reset()
          resolve(false)
        })
    })
  }

  return {
    isInitialized,
    isLogged,
    current: computed(() => isLogged.value ? user : null),
    register,
    login,
    logout,
    getAllUsers,
    checkSession,
  }
})

