<template>
  <view v-if="toastState.visible" class="toast-overlay" @click="hideToast">
    <view class="toast-box" :class="[toastState.type]" @click.stop>
      <text class="toast-icon">{{ iconMap[toastState.type] }}</text>
      <text class="toast-message">{{ toastState.message }}</text>
    </view>
  </view>
</template>

<script setup>
import { toastState, hideToast } from '@/utils/toast.js'

const iconMap = {
  success: '✅',
  error: '❌',
  info: '💬',
  warning: '⚠️',
}
</script>

<style scoped>
.toast-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.toast-box {
  background: #2731ff;
  border-radius: 20rpx;
  padding: 28rpx 44rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 8px 32px rgba(39, 49, 255, 0.3);
  pointer-events: auto;
  animation: toastIn 0.25s ease-out;
}
.toast-box.success {
  background: #ffffff;
  border: 5rpx solid #2731ff;
  box-shadow: 0 8px 32px rgba(39, 49, 255, 0.2);
}
.toast-box.success .toast-message {
  color: #2731ff;
}
.toast-box.error {
  background: #ff4545;
  box-shadow: 0 8px 32px rgba(255, 69, 69, 0.3);
}
.toast-box.warning {
  background: #f0a428;
  box-shadow: 0 8px 32px rgba(240, 164, 40, 0.3);
}

.toast-icon {
  font-size: 32rpx;
}

.toast-message {
  font-size: 28rpx;
  font-weight: 700;
  color: #ffffff;
  max-width: 400rpx;
  text-align: center;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
