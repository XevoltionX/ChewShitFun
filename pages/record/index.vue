<template>
  <view class="page">
    <text class="placeholder">💩 记录页（后续实现）</text>
    <custom-tabbar />
  </view>
</template>

<script setup>
import CustomTabbar from '@/components/custom-tabbar.vue'
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 70px;
}
.placeholder {
  font-size: 18px;
  font-weight: 600;
  color: #999999;
}
</style>
