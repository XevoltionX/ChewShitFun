<template>
  <view class="calendar-grid" :class="{ night: isNight }">
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
        :data-date="cell.dateStr"
        @click="cell.dateStr && onCellClick(cell)"
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
import { isNight } from '@/utils/theme.js'
import { playBobo } from '@/utils/sound.js'

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
    const bgColors = ['#fff', '#fddca5', '#f59d51', '#8d5b2c']
    const borderColors = ['#e0e0e0', '#e8d5c0', '#d4a97a', '#8d5b2c']
    const isToday = dateStr === todayStr

    result.push({
      day: d,
      dateStr,
      hasRecord: count > 0,
      count,
      style: {
        background: bgColors[level],
        border: `2px solid ${borderColors[level]}`,
        boxShadow: isToday ? 'inset 0 0 0 2px #2731ff' : 'none',
      },
    })
  }

  return result
})

function onCellClick(cell) {
  uni.createSelectorQuery()
    .selectAll('.date-cell')
    .boundingClientRect()
    .exec((res) => {
      const rects = res[0] || []
      const idx = cells.value.indexOf(cell)
      const r = rects[idx]
      const pos = r ? { x: r.left + r.width / 2, y: r.top + r.height * 2 + 6 } : {}
      emit('cell-click', { dateStr: cell.dateStr, count: cell.count || 0, pos })
    })
}

function changeMonth(delta) {
  playBobo()
  let m = currentMonth.value + delta
  let y = currentYear.value
  if (m === 0) { m = 12; y-- }
  if (m === 13) { m = 1; y++ }
  currentYear.value = y
  currentMonth.value = m
}
</script>

<style scoped>
.calendar-grid {
  padding: 12px 10px;
  margin: 20rpx 20rpx 0;
  background: #fff;
  border: 4rpx solid rgba(39, 49, 255, 0.2);
  border-radius: 20rpx;
  transition: all 0.25s ease;
}
.calendar-grid:active {
  background: #e8ecf8;
  border-color: rgba(15, 20, 200, 0.45);
  border-width: 8rpx;
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
  color: #333333;
}

.month-arrow {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  color: #2731ff;
  border: 2px solid #2731ff;
  border-radius: 20px;
  transition: all 0.2s;
}
.month-arrow:active {
  background: #2731ff;
  color: #fff;
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
  color: #999999;
  padding: 6px 0;
}

.date-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.date-cell {
  height: 0;
  padding-bottom: 100%;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}
.date-cell text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.cell-date {
  top: 25%;
  font-size: 14px;
  font-weight: 700;
  color: #333333;
}

.cell-emoji {
  top: 58%;
  font-size: 16px;
}

.calendar-grid.night {
  background: #667788;
  border-color: rgba(255,255,255,0.15);
}
.calendar-grid.night .month-title {
  color: #ffffff;
}
.calendar-grid.night .weekday-cell {
  color: #bbbbbb;
}
.calendar-grid.night .cell-date {
  color: #222222 !important;
}
.calendar-grid.night .date-cell {
  border-color: rgba(255,255,255,0.15);
}
</style>
