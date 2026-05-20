import { defineStore } from 'pinia'
import { getRecords, saveRecords } from '@/utils/storage.js'

export const usePoopStore = defineStore('poop', {
  state: () => ({
    records: [],
  }),

  getters: {
    getByDate: (state) => (dateStr) => {
      return state.records.filter(r => {
        const d = new Date(r.timestamp)
        const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        return ds === dateStr
      })
    },

    getCountByDate: (state) => (dateStr) => {
      return state.records.filter(r => {
        const d = new Date(r.timestamp)
        const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        return ds === dateStr
      }).length
    },

    getMonthSummary: (state) => (year, month) => {
      const map = {}
      state.records.forEach(r => {
        const d = new Date(r.timestamp)
        if (d.getFullYear() === year && d.getMonth() + 1 === month) {
          const ds = `${year}-${String(month).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
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
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
        ...record,
      })
      saveRecords(this.records)
    },
  },
})
