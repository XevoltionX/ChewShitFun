import { defineStore } from 'pinia'
import { getUserConfig, saveUserConfig } from '@/utils/storage.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    config: { lastUsername: '', presetNames: ['余苟千', '朋友A', '朋友B', '朋友C'] },
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
