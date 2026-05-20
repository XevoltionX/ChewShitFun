import { defineStore } from 'pinia'
import { getUserConfig, saveUserConfig, DEFAULT_USER_CONFIG } from '@/utils/storage.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    config: { ...DEFAULT_USER_CONFIG },
    currentUser: '',
  }),

  actions: {
    loadConfig() {
      this.config = getUserConfig()
      this.currentUser = this.config.lastUsername || ''
    },

    setLastUsername(name) {
      this.config.lastUsername = name
      this.currentUser = name
      saveUserConfig(this.config)
    },
  },
})
