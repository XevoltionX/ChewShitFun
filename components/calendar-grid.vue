<template>
  <view class="calendar-grid">
    <view class="month-header">
      <view class="month-arrow" @click="changeMonth(-1)">‹</view>
      <text class="month-title">{{ currentYear }}年{{ currentMonth }}月</text>
      <view class="month-arrow" @click="changeMonth(1)">›</view>
    </view>

    <view class="weekday-row">
      <text v-for="w in weekdays" :key="w" class="weekday-cell">{{ w }}</text>
    </view>

    <view class="date-grid">
      <view
        v-for="(cell, idx) in cells"
        :key="idx"
        class="date-cell"
        :style="cell.style"
        @click="cell.dateStr && emit('cell-click', { dateStr: cell.dateStr, count: cell.count || 0 })"
      >
        <text class="cell-date">{{ cell.day }}</text>
        <text class="cell-emoji" v-if="cell.hasRecord">💩</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePoopStore } from '@/stores/poop.js'

const emit = defineEmits(['cell-click'])

const poopStore = usePoopStore()
const weekdays = ['一', '二', '三', '四', '五', '六', '日']

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth() + 1)

const cells = computed(() => {
  const y = currentYear.value
  const m = currentMonth.value
  const firstDay = new Date(y, m - 1, 1)
  const lastDay = new Date(y, m, 0)
  const daysInMonth = lastDay.getDate()
  let startDow = firstDay.getDay()
  startDow = startDow === 0 ? 6 : startDow - 1

  const monthSummary = poopStore.getMonthSummary(y, m)
  const todayDate = new Date()
  const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`

  const result = []

  for (let i = 0; i < startDow; i++) {
    result.push({ day: '', dateStr: '', hasRecord: false, style: {}, count: 0 })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const count = monthSummary[dateStr] || 0
    const level = Math.min(count, 3)
    const bgColors = ['#fff', '#fdf5ee', '#fbe8d0', '#f5d4a8']
    const borderColors = ['#e0e0e0', '#e8d5c0', '#d4a97a', '#b8783a']
    const isToday = dateStr === todayStr

    result.push({
      day: d,
      dateStr,
      hasRecord: count > 0,
      count,
      style: {
        background: bgColors[level],
        border: `2px solid ${borderColors[level]}`,
        boxShadow: isToday ? 'inset 0 0 0 2px #4D6BFE' : 'none',
      },
    })
  }

  return result
})

function changeMonth(delta) {
  let m = currentMonth.value + delta
  let y = currentYear.value
  if (m === 0) { m = 12; y-- }
  if (m === 13) { m = 1; y++ }
  currentYear.value = y
  currentMonth.value = m
}
</script>

<style lang="scss" scoped>
.calendar-grid {
  padding: 12px 10px;
}

.month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 8px;
}

.month-title {
  font-size: 20px;
  font-weight: 700;
  color: $color-text;
}

.month-arrow {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  color: $color-primary;
  border: $border-width-base solid $color-primary;
  border-radius: $border-radius-lg;
}

.weekday-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 6px;
}

.weekday-cell {
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: $color-text-light;
  padding: 6px 0;
}

.date-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.date-cell {
  aspect-ratio: 1;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cell-date {
  font-size: 14px;
  font-weight: 700;
  color: $color-text;
}

.cell-emoji {
  font-size: 16px;
  margin-top: 1px;
}
</style>
