<template>
  <view class="login-page">
    <view class="login-content">
      <view class="logo-area">
        <text class="logo-emoji">💩</text>
        <text class="logo-title">ChewShitFun</text>
      </view>

      <view class="form-area">
        <input
          class="name-input"
          v-model="username"
          placeholder="输入用户名..."
          placeholder-style="color: rgba(255,255,255,0.4);"
          maxlength="20"
          confirm-type="done"
          @confirm="handleEnter"
        />
        <view class="hint-area">
          <text class="hint-label">可用用户名：</text>
          <view class="hint-names">
            <text
              v-for="name in presetNames"
              :key="name"
              class="hint-name-tag"
              @click="username = name"
            >{{ name }}</text>
          </view>
        </view>
        <view class="btn-enter" @click="handleEnter">
          <text class="btn-text">进 入</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '@/stores/user.js'

export default {
  data() {
    return {
      username: '',
      presetNames: [],
    }
  },
  created() {
    const userStore = useUserStore()
    userStore.loadConfig()
    this.username = userStore.config.lastUsername
    this.presetNames = userStore.config.presetNames
  },
  methods: {
    handleEnter() {
      const userStore = useUserStore()
      const name = this.username.trim()
      if (!name) {
        uni.showToast({ title: '好歹输入个名字吧~', icon: 'none' })
        return
      }
      if (!this.presetNames.includes(name)) {
        uni.showToast({ title: '不在名单上，换一个试试~', icon: 'none' })
        return
      }
      userStore.setLastUsername(name)
      uni.switchTab({ url: '/pages/calendar/index' })
    },
  },
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background-color: #1a2744;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
}

.login-content {
  width: 100%;
  max-width: 320px;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48px;
}

.logo-emoji {
  font-size: 72px;
  margin-bottom: 12px;
}

.logo-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
}

.form-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.name-input {
  height: 52px;
  background: rgba(255, 255, 255, 0.12);
  border: 3px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  padding: 0 18px;
  font-size: 17px;
  font-weight: 600;
  color: #fff;
}

.hint-area {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.hint-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

.hint-names {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hint-name-tag {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 4px 14px;
  border: 2px solid rgba(255, 255, 255, 0.25);
}

.btn-enter {
  margin-top: 12px;
  height: 52px;
  background: #8B5E3C;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #7a5230;
}

.btn-text {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 4px;
}
</style>
