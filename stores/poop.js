import { defineStore } from 'pinia'
import { getRecords, saveRecords } from '@/utils/storage.js'

function formatDate(timestamp) {
  const d = new Date(timestamp)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const usePoopStore = defineStore('poop', {
  state: () => ({
    records: [],
  }),

  getters: {
    getByDate: (state) => (dateStr) => {
      return state.records.filter(r => formatDate(r.timestamp) === dateStr)
    },

    getCountByDate: (state) => (dateStr) => {
      return state.records.filter(r => formatDate(r.timestamp) === dateStr).length
    },

    getMonthSummary: (state) => (year, month) => {
      const map = {}
      state.records.forEach(r => {
        const d = new Date(r.timestamp)
        if (d.getFullYear() === year && d.getMonth() + 1 === month) {
          const ds = formatDate(r.timestamp)
          map[ds] = (map[ds] || 0) + 1
        }
      })
      return map
    },
  },

  actions: {
    loadFromStorage() {
      this.records = getRecords()
    },

    addRecord(record) {
      this.records.push({
        ...record,
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
      })
      saveRecords(this.records)
    },
  },
})
