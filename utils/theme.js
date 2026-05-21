import { ref } from 'vue'

const THEME_KEY = 'csf_theme'

const isNight = ref(false)

function loadTheme() {
  try {
    const val = uni.getStorageSync(THEME_KEY)
    isNight.value = val === 'night'
  } catch (e) { isNight.value = false }
}

function toggleTheme() {
  isNight.value = !isNight.value
  uni.setStorageSync(THEME_KEY, isNight.value ? 'night' : 'day')
}

// Day / Night 颜色映射
const colors = {
  day: {
    bg: '#f5f5f5',
    blue: '#2731ff',
    blueName: 'day',
  },
  night: {
    bg: '#1a2744',
    blue: '#1a2744',
    blueName: 'night',
  },
}

export { isNight, loadTheme, toggleTheme, colors }
