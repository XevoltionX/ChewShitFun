<template>
  <view class="calendar-page">
    <calendar-grid @cell-click="handleCellClick" />
    <custom-tabbar />
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { usePoopStore } from '@/stores/poop.js'
import CalendarGrid from '@/components/calendar-grid.vue'
import CustomTabbar from '@/components/custom-tabbar.vue'

const poopStore = usePoopStore()

onShow(() => {
  poopStore.loadFromStorage()
})

function handleCellClick({ dateStr, count }) {
  // Bubble card popup will be added in Task 6
  console.log('click date:', dateStr, 'count:', count)
}
</script>

<style lang="scss" scoped>
.calendar-page {
  min-height: 100vh;
  background: $color-bg;
  padding-bottom: 70px;
}
</style>
