import { reactive } from 'vue'

export const toastState = reactive({
  visible: false,
  message: '',
  type: 'info',
})

let toastTimer = null

export function showToast(message, opts = {}) {
  clearTimeout(toastTimer)
  toastState.message = message
  toastState.type = opts.type || 'info'
  toastState.visible = true

  const duration = opts.duration || 2000
  if (duration > 0) {
    toastTimer = setTimeout(() => {
      toastState.visible = false
    }, duration)
  }
}

export function hideToast() {
  clearTimeout(toastTimer)
  toastState.visible = false
}
