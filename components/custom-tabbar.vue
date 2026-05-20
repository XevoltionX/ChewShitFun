<template>
  <view class="custom-tabbar">
    <view
      v-for="(item, index) in tabList"
      :key="index"
      class="tabbar-item"
      @click="switchTab(index)"
    >
      <text class="tabbar-icon">{{ item.icon }}</text>
      <text
        class="tabbar-text"
        :class="{ active: current === index }"
      >{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const tabList = [
  { pagePath: '/pages/calendar/index', text: '日历', icon: '📅' },
  { pagePath: '/pages/record/index', text: '记录', icon: '💩' },
  { pagePath: '/pages/user/index', text: '用户', icon: '👤' },
]

const current = ref(0)

function switchTab(index) {
  current.value = index
  uni.switchTab({ url: tabList[index].pagePath })
}
</script>

<style scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 2px solid #eee;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 16px;
}

.tabbar-icon {
  font-size: 22px;
}

.tabbar-text {
  font-size: 11px;
  font-weight: 600;
  color: #999999;
}

.tabbar-text.active {
  color: #4D6BFE;
  font-weight: 700;
}
</style>
