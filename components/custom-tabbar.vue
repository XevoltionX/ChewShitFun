<template>
  <view class="custom-tabbar" :class="{ night: isNight }" :style="tabbarStyle">
    <view class="tab-indicator" :style="indicatorStyle" />

    <view
      v-for="(item, index) in tabList"
      :key="index"
      class="tabbar-item"
      :class="{ center: index === 1, active: currentTab === index }"
      @click="switchTab(index)"
    >
      <view class="tabbar-icon-wrap" :class="{ center: index === 1 }">
        <!-- 中间大按钮 -->
        <text v-if="index === 1" class="tabbar-icon center" :class="{ active: currentTab === index }">💩</text>
        <!-- 战绩: 日历网格图标 -->
        <view v-else-if="index === 0" class="css-icon cal-icon" :class="{ active: currentTab === index }">
          <view class="cal-dot" />
          <view class="cal-dot" />
          <view class="cal-dot" />
          <view class="cal-dot" />
        </view>
        <!-- 用户: 人物图标 -->
        <view v-else class="css-icon user-icon" :class="{ active: currentTab === index }">
          <view class="user-head" />
          <view class="user-body" />
        </view>
      </view>
      <text
        class="tabbar-text"
        :class="{ active: currentTab === index }"
      >{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { isNight } from '@/utils/theme.js'
import { playBobo } from '@/utils/sound.js'

const props = defineProps({
  currentTab: { type: Number, default: 0 },
})

const tabList = [
  { pagePath: '/pages/calendar/index', text: '战绩', icon: '' },
  { pagePath: '/pages/record/index', text: '马上拉屎', icon: '' },
  { pagePath: '/pages/user/index', text: '用户', icon: '' },
]

const indicatorStyle = computed(() => {
  const pct = props.currentTab / (tabList.length - 1) * 100
  return { left: `${pct}%`, background: isNight.value ? '#343b99' : '#2731ff' }
})

const tabbarStyle = computed(() => {
  if (isNight.value) return { background: '#343b99', borderTopColor: '#1a2744' }
  return {}
})

function switchTab(index) {
  if (index === props.currentTab) return
  playBobo()
  setTimeout(() => uni.vibrateShort(), 120)
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
  border-top: 2px solid #2731ff;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
}

.tab-indicator {
  position: absolute;
  top: 0;
  width: 36px;
  height: 3px;
  background: #2731ff;
  border-radius: 0 0 5px 5px;
  transform: translateX(-50%);
  transition: left 0.45s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 16px;
  position: relative;
}
.tabbar-item.center {
  padding-top: 0;
}
.tabbar-item.active:not(.center) {
  animation: sideBounce 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

.tabbar-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tabbar-icon-wrap.center {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #8B5E3C;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -32px;
  box-shadow: 0 4px 12px rgba(139, 94, 60, 0.35);
}
.tabbar-item.center.active .tabbar-icon-wrap.center {
  animation: centerBounce 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

.tabbar-icon.center {
  font-size: 30px;
}

/* CSS 图标 */
.css-icon {
  width: 22px;
  height: 22px;
  position: relative;
}
.css-icon.active {
  animation: iconBounce 0.45s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

/* 日历图标: 2×2 点阵 */
.cal-icon {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 3px;
  box-sizing: border-box;
}
.cal-dot {
  width: 6px;
  height: 6px;
  border-radius: 2px;
  background: #999;
}
.cal-icon.active .cal-dot {
  animation: dotColorBounce 0.45s ease forwards;
}

/* 用户图标: 圆头 + 半圆身体 */
.user-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.user-head {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #999;
}
.user-body {
  width: 18px;
  height: 8px;
  border-radius: 10px 10px 0 0;
  background: #999;
}
.user-icon.active .user-head,
.user-icon.active .user-body {
  animation: dotColorBounce 0.45s ease forwards;
}

.tabbar-text {
  font-size: 14px;
  font-weight: 600;
  color: #999999;
}
.tabbar-text.active {
  animation: textBounce 0.45s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

.night .tabbar-text {
  color: #9999bb;
}
.night .tabbar-text.active {
  color: #ffffff;
}
.night .cal-dot,
.night .user-head,
.night .user-body {
  background: #9999bb;
}
.night .cal-icon.active .cal-dot,
.night .user-icon.active .user-head,
.night .user-icon.active .user-body {
  background: #ffffff;
}

/* 多段弹跳动画: idle → 峰值 → 回弹到接近idle → 稳定到原版激活态 */
@keyframes sideBounce {
  0%   { transform: translateY(0); }
  25%  { transform: translateY(-6px); }
  50%  { transform: translateY(2px); }
  75%  { transform: translateY(-3px); }
  100% { transform: translateY(-2px); }
}

@keyframes iconBounce {
  0%   { transform: scale(1); }
  25%  { transform: scale(1.35); }
  55%  { transform: scale(0.92); }
  80%  { transform: scale(1.08); }
  100% { transform: scale(1.15); }
}

@keyframes textBounce {
  0%   { color: #999; font-weight: 600; transform: scale(1); }
  25%  { color: #1a25cc; font-weight: 800; transform: scale(1.12); }
  55%  { color: #888; font-weight: 500; transform: scale(0.95); }
  80%  { color: #2731ff; font-weight: 700; transform: scale(1.03); }
  100% { color: #2731ff; font-weight: 700; transform: scale(1.05); }
}

@keyframes centerBounce {
  0%   { transform: scale(1); box-shadow: 0 4px 12px rgba(139, 94, 60, 0.35); }
  25%  { transform: scale(1.15); box-shadow: 0 10px 28px rgba(139, 94, 60, 0.55); }
  55%  { transform: scale(0.95); box-shadow: 0 3px 8px rgba(139, 94, 60, 0.25); }
  80%  { transform: scale(1.05); box-shadow: 0 5px 14px rgba(139, 94, 60, 0.4); }
  100% { transform: scale(1.08); box-shadow: 0 6px 18px rgba(139, 94, 60, 0.45); }
}

@keyframes dotColorBounce {
  0%   { background: #999; }
  25%  { background: #1a25cc; }
  55%  { background: #aaa; }
  80%  { background: #3a4fff; }
  100% { background: #2731ff; }
}
</style>
