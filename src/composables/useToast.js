import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  const addToast = (message, type = 'success', duration = 3000) => {
    const id = ++toastId
    toasts.value.push({ id, message, type, visible: true })

    setTimeout(() => {
      const index = toasts.value.findIndex(t => t.id === id)
      if (index !== -1) {
        toasts.value[index].visible = false
        setTimeout(() => {
          toasts.value = toasts.value.filter(t => t.id !== id)
        }, 300)
      }
    }, duration)
  }

  const success = (message) => addToast(message, 'success')
  const error = (message) => addToast(message, 'error')
  const info = (message) => addToast(message, 'info')

  return {
    toasts,
    addToast,
    success,
    error,
    info
  }
}
