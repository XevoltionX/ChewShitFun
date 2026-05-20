<template>
  <view class="calendar-page">
    <calendar-grid @cell-click="handleCellClick" />

    <day-card-popup
      :visible="popupVisible"
      :dateStr="popupDateStr"
      :posX="popupX"
      :posY="popupY"
      @close="popupVisible = false"
    />

    <custom-tabbar />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { usePoopStore } from '@/stores/poop.js'
import CalendarGrid from '@/components/calendar-grid.vue'
import DayCardPopup from '@/components/day-card-popup.vue'
import CustomTabbar from '@/components/custom-tabbar.vue'

const poopStore = usePoopStore()

onShow(() => {
  poopStore.loadFromStorage()
})

const popupVisible = ref(false)
const popupDateStr = ref('')
const popupX = ref(180)
const popupY = ref(300)

function handleCellClick({ dateStr, count }) {
  popupDateStr.value = dateStr
  popupVisible.value = true
  const systemInfo = uni.getSystemInfoSync()
  popupX.value = systemInfo.windowWidth / 2
  popupY.value = systemInfo.windowHeight * 0.28
}
</script>

<style lang="scss" scoped>
.calendar-page {
  min-height: 100vh;
  background: $color-bg;
  padding-bottom: 70px;
}
</style>
