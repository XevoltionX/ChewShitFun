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

<script>
import { usePoopStore } from '@/stores/poop.js'
import CalendarGrid from '@/components/calendar-grid.vue'
import DayCardPopup from '@/components/day-card-popup.vue'
import CustomTabbar from '@/components/custom-tabbar.vue'

export default {
  components: { CalendarGrid, DayCardPopup, CustomTabbar },
  data() {
    return {
      popupVisible: false,
      popupDateStr: '',
      popupX: 180,
      popupY: 300,
    }
  },
  onShow() {
    const poopStore = usePoopStore()
    poopStore.loadFromStorage()
  },
  methods: {
    handleCellClick({ dateStr }) {
      this.popupDateStr = dateStr
      this.popupVisible = true
      const systemInfo = uni.getSystemInfoSync()
      this.popupX = systemInfo.windowWidth / 2
      this.popupY = systemInfo.windowHeight * 0.28
    },
  },
}
</script>

<style scoped>
.calendar-page {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 70px;
}
</style>
