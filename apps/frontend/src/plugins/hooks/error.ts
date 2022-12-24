import { ref } from 'vue'

export function useError() {
  const message = ref('')
  const visible = ref(false)

  function show(msg: string) {
    visible.value = true
    message.value = msg
  }

  function hide() {
    visible.value = false
    message.value = ''
  }

  return {
    message,
    visible,
    show,
    hide,
  }
}