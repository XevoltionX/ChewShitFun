<template>
  <view class="page">
    <text class="placeholder">📅 日历页（下一步实现）</text>
    <custom-tabbar />
  </view>
</template>

<script setup>
import CustomTabbar from '@/components/custom-tabbar.vue'
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 70px;
}
.placeholder {
  font-size: 18px;
  font-weight: $font-weight-base;
  color: $color-text-light;
}
</style>
