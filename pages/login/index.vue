<template>
  <view class="login-container">
    <view class="login-content">
      <text class="login-emoji">💩</text>
      <text class="login-title">ChewShitFun</text>

      <view class="input-wrap">
        <input
          class="username-input"
          v-model="username"
          placeholder="输入用户名..."
          placeholder-style="color: #8899aa"
          confirm-type="done"
          @confirm="doLogin"
        />
      </view>

      <view class="preset-hints">
        <text class="hint-label">厕试ID：</text>
        <text
          v-for="(name, idx) in presetNames"
          :key="idx"
          class="hint-name"
          @click="playBobo(); username = name"
        >{{ name }}</text>
      </view>

      <view class="login-btn" @click="doLogin">
        <text class="login-btn-text">进 入 厕 门</text>
      </view>
    </view>
    <toast-notification />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserConfig, saveUserConfig, DEFAULT_USER_CONFIG } from '@/utils/storage.js'
import { showToast } from '@/utils/toast.js'
import { playBobo } from '@/utils/sound.js'
import ToastNotification from '@/components/toast-notification.vue'

const username = ref('')
const presetNames = DEFAULT_USER_CONFIG.presetNames

onMounted(() => {
  const config = getUserConfig()
  if (config.lastUsername) {
    username.value = config.lastUsername
  }
})

function doLogin() {
  playBobo()
  const name = username.value.trim()
  if (!name) {
    showToast('请输入你的厕试名字', { type: 'error' })
    return
  }
  if (!presetNames.includes(name)) {
    showToast('你是谁啊？不在名单里！', { type: 'error' })
    return
  }
  saveUserConfig({ ...getUserConfig(), lastUsername: name })
  uni.vibrateShort()
  showToast(`欢迎回厕，${name}`, { type: 'success' })
  setTimeout(() => {
    uni.switchTab({ url: '/pages/calendar/index' })
  }, 400)
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: #1a2744;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 60rpx;
  width: 100%;
}

.login-emoji {
  font-size: 100rpx;
  margin-bottom: 16rpx;
}

.login-title {
  font-size: 44rpx;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 4rpx;
  margin-bottom: 80rpx;
}

.input-wrap {
  width: 100%;
  margin-bottom: 24rpx;
}

.username-input {
  width: 100%;
  height: 88rpx;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16rpx;
  padding: 0 28rpx;
  font-size: 30rpx;
  color: #ffffff;
  text-align: center;
  box-sizing: border-box;
}

.preset-hints {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 60rpx;
}

.hint-label {
  font-size: 24rpx;
  color: #667788;
}

.hint-name {
  font-size: 24rpx;
  color: #8899bb;
  background: rgba(255, 255, 255, 0.08);
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
  transition: background-color 0.15s;
}
.hint-name:active {
  background: rgba(255, 255, 255, 0.2);
}

.login-btn {
  width: 100%;
  height: 88rpx;
  background-color: #8B5E3C;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s;
}
.login-btn:active {
  animation: loginBounce 0.45s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes loginBounce {
  0%   { transform: scale(1); background-color: #8B5E3C; }
  25%  { transform: scale(0.94); background-color: #3a1e0d; }
  55%  { transform: scale(1.03); background-color: #7a4e2e; }
  80%  { transform: scale(0.98); background-color: #6b3e22; }
  100% { transform: scale(1); background-color: #8B5E3C; }
}

.login-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 8rpx;
}
</style>
