import { ref } from 'vue'

export function useAlert() {
  const message = ref('')
  const visible = ref(false)
  const isError = ref(false)

  function show(msg: string, error = false) {
    visible.value = true
    message.value = msg
    isError.value = error
  }

  function hide() {
    visible.value = false
    message.value = ''
  }

  return {
    message,
    visible,
    isError,
    show,
    hide,
  }
}