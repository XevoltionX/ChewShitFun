<template>
  <view class="container" :class="{ night: isNight }" :style="{ backgroundColor: isNight ? colors.night.bg : colors.day.bg }">
    <view class="header">
      <view class="username-row">
        <view class="user-icon-css">
          <view class="u-head" />
          <view class="u-body" />
        </view>
        <text class="username">{{ username }}</text>
      </view>
      <view class="logout-btn" @click.stop="onLogout">
        <text class="logout-text">退出登录</text>
      </view>
    </view>

    <view class="card">
      <text class="card-title">本月战报</text>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ monthStats.totalCount }}</text>
          <text class="stat-label">总次数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ monthStats.activeDays }} / {{ monthStats.totalDays }}</text>
          <text class="stat-label">天数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ monthStats.topConsistency || '-' }} · {{ monthStats.topSmell || '-' }}</text>
          <text class="stat-label">最常见</text>
        </view>
      </view>

      <view class="trend-section">
        <text class="trend-label">周趋势</text>
        <view class="bar-chart">
          <view v-for="(val, idx) in weeklyTrend" :key="idx" class="bar-col">
            <view class="bar" :style="{ height: barHeight(val) + 'px' }"></view>
            <text class="bar-text">{{ val }}</text>
            <text class="bar-week">W{{ idx + 1 }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="card">
      <text class="card-title">成就徽章</text>
      <view class="badge-grid">
        <view v-for="a in achievements" :key="a.icon" class="badge-item" :class="{ locked: !a.unlocked }">
          <text class="badge-icon">{{ a.unlocked ? a.icon : '🔒' }}</text>
          <text class="badge-name">{{ a.name }}</text>
        </view>
      </view>
    </view>

    <view class="card">
      <text class="card-title">🧪 Toast 测试</text>
      <view class="toast-test-grid">
        <view class="test-btn" @click="playBobo(); showToast('C4安放成功！', { type: 'success' })">
          <text>✅ Success</text>
        </view>
        <view class="test-btn" @click="playBobo(); showToast('炸弹已被拆除', { type: 'error' })">
          <text>❌ Error</text>
        </view>
        <view class="test-btn" @click="playBobo(); showToast('肠道状态良好', { type: 'info' })">
          <text>💬 Info</text>
        </view>
        <view class="test-btn" @click="playBobo(); showToast('注意饮食', { type: 'warning' })">
          <text>⚠️ Warning</text>
        </view>
        <view class="test-btn night-btn" @click="playBobo(); toggleTheme()">
          <text>{{ isNight ? '☀️ 日间' : '🌙 夜间' }}</text>
        </view>
      </view>
    </view>

    <view class="share-btn" @click="onShare">
      <text class="share-btn-text">📸 生成月度战报</text>
    </view>
    <view class="share-btn" @click="onShare">
      <text class="share-btn-text">点Call骚扰我</text>
    </view>

    <toast-notification />
    <custom-tabbar :currentTab="2" />
  </view>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { usePoopStore } from '@/stores/poop.js'
import { getUserConfig } from '@/utils/storage.js'
import CustomTabbar from '@/components/custom-tabbar.vue'
import { showToast } from '@/utils/toast.js'
import ToastNotification from '@/components/toast-notification.vue'
import { isNight, toggleTheme, colors } from '@/utils/theme.js'
import { playBobo } from '@/utils/sound.js'

const poopStore = usePoopStore()
const userConfig = getUserConfig()
const username = computed(() => userConfig.lastUsername || '未知用户')

const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1
const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()

function formatDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const monthStats = computed(() => {
  const records = poopStore.records.filter(r => {
    const d = new Date(r.timestamp)
    return d.getFullYear() === currentYear && d.getMonth() + 1 === currentMonth
  })

  const activeDaySet = new Set(records.map(r => {
    const d = new Date(r.timestamp)
    return formatDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
  }))

  const top = mode(records.map(r => r.consistency))
  const topSmell = mode(records.map(r => r.smell))

  return {
    totalCount: records.length,
    activeDays: activeDaySet.size,
    totalDays: daysInMonth,
    topConsistency: top,
    topSmell: topSmell,
  }
})

const weeklyTrend = computed(() => {
  const summary = poopStore.getMonthSummary(currentYear, currentMonth)
  const weeks = [0, 0, 0, 0]
  Object.entries(summary).forEach(([dateStr, count]) => {
    const day = parseInt(dateStr.split('-')[2])
    const wIdx = day <= 7 ? 0 : day <= 14 ? 1 : day <= 21 ? 2 : 3
    weeks[wIdx] += count
  })
  return weeks
})

function barHeight(val) {
  const max = Math.max(...weeklyTrend.value, 1)
  return Math.max(4, (val / max) * 80)
}

const achievements = computed(() => {
  const records = poopStore.records
  const allDates = [...new Set(records.map(r => {
    const d = new Date(r.timestamp)
    return formatDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
  }))].sort()

  let hasStreak7 = false
  let streak = 1
  for (let i = 1; i < allDates.length; i++) {
    const prev = new Date(allDates[i - 1])
    const curr = new Date(allDates[i])
    if ((curr - prev) / 86400000 === 1) {
      streak++
      if (streak >= 7) { hasStreak7 = true; break }
    } else {
      streak = 1
    }
  }

  const monthMap = {}
  records.forEach(r => {
    const d = new Date(r.timestamp)
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`
    if (!monthMap[key]) monthMap[key] = new Set()
    monthMap[key].add(d.getDate())
  })
  let hasFullMonth = false
  for (const [key, daySet] of Object.entries(monthMap)) {
    const [y, m] = key.split('-').map(Number)
    const dim = new Date(y, m, 0).getDate()
    if (daySet.size === dim) { hasFullMonth = true; break }
  }

  const colorSet = new Set(records.map(r => r.color).filter(Boolean))

  return [
    { icon: '🎖', name: '初次安放', unlocked: records.length >= 1 },
    { icon: '🔥', name: '稳定输出', unlocked: hasStreak7 },
    { icon: '☣️', name: '生化武器专家', unlocked: records.filter(r => r.smell === '生化武器').length >= 10 },
    { icon: '👑', name: '打卡狂魔', unlocked: hasFullMonth },
    { icon: '💎', name: '五彩斑斓', unlocked: colorSet.size >= 4 },
  ]
})

function mode(arr) {
  const filtered = arr.filter(Boolean)
  if (filtered.length === 0) return null
  const map = {}
  filtered.forEach(v => { map[v] = (map[v] || 0) + 1 })
  return Object.entries(map).sort((a, b) => b[1] - a[1])[0][0]
}

onMounted(() => uni.hideTabBar())

function onShare() {
  playBobo()
  showToast('嘻嘻,这个功能还没做,等我做下一个版本吧', { type: 'info' })
}

function onLogout() {
  playBobo()
  uni.vibrateShort()
  showToast('远行的游子啊，再见', { type: 'info' })
  setTimeout(() => {
    uni.reLaunch({ url: '/pages/login/index' })
  }, 800)
}
</script>

<style scoped>
.container {
  background-color: #f5f5f5;
  padding-bottom: 90px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 32rpx 24rpx;
}
.username-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.user-icon-css {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rpx;
}
.u-head {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #333;
}
.u-body {
  width: 32rpx;
  height: 14rpx;
  border-radius: 16rpx 16rpx 0 0;
  background: #333;
}
.username {
  font-size: 40rpx;
  font-weight: 800;
  color: #333;
}
.logout-btn {
  background: #b3d4ff;
  padding: 10rpx 28rpx;
  border-radius: 20rpx;
  transition: background-color 0.15s;
}
.logout-btn:active {
  animation: logoutBounce 0.45s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes logoutBounce {
  0%   { transform: scale(1); background: #b3d4ff; }
  25%  { transform: scale(0.92); background: #6a9fd8; }
  55%  { transform: scale(1.04); background: #9dc4f0; }
  80%  { transform: scale(0.97); background: #8ab8f0; }
  100% { transform: scale(1); background: #b3d4ff; }
}
.logout-text {
  font-size: 26rpx;
  font-weight: 800;
  color: #2731ff;
}

.card {
  border: 6rpx solid #2731ff;
  background: #fff;
  border-radius: 24rpx;
  margin: 0 24rpx 20rpx;
  padding: 28rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.25s ease;
}
.card:active {
  background: #e8ecf8;
  border-color: rgba(15, 20, 200, 0.6);
  border-width: 10rpx;
}
.card:active .card-title {
  font-weight: 900;
  transform: scale(1.03);
}
.card-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.stats-grid {
  display: flex;
  justify-content: space-around;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
}
.stat-value {
  font-size: 32rpx;
  font-weight: 800;
  color: #2731ff;
}
.stat-label {
  font-size: 22rpx;
  color: #999;
}

.trend-section {
  margin-top: 28rpx;
  border-top: 1px solid #f0f0f0;
  padding-top: 20rpx;
}
.trend-label {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 16rpx;
  display: block;
}
.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 140rpx;
}
.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}
.bar {
  width: 48rpx;
  background: #2731ff;
  border-radius: 8rpx 8rpx 0 0;
  min-height: 4rpx;
  transition: height 0.3s;
}
.bar-text {
  font-size: 22rpx;
  font-weight: 700;
  color: #333;
}
.bar-week {
  font-size: 18rpx;
  color: #bbb;
}

.badge-grid {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 16rpx;
}
.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  padding: 12rpx 20rpx;
  transition: all 0.25s ease;
}
.badge-item:active {
  transform: scale(0.92);
}
.badge-item.locked {
  opacity: 0.35;
}
.badge-icon {
  font-size: 44rpx;
}
.badge-name {
  font-size: 20rpx;
  font-weight: 600;
  color: #666;
}

.share-btn {
  margin: 32rpx 24rpx;
  height: 88rpx;
  background-color: #8B5E3C;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}
.share-btn:active {
  background-color: #5a3a1e;
  transform: scale(0.97);
}
.share-btn:active .share-btn-text {
  font-weight: 900;
  transform: scale(1.03);
}
.share-btn-text {
  font-size: 30rpx;
  font-weight: 700;
  color: #fff;
}

.toast-test-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  row-gap: 20rpx;
}
.test-btn {
  background: #2731ff;
  padding: 14rpx 28rpx;
  border-radius: 16rpx;
  margin-bottom: 8rpx;
  transition: all 0.25s ease;
}
.test-btn:active {
  background: #1a25cc;
  transform: scale(0.94);
}
.test-btn:active text {
  font-weight: 900;
  transform: scale(1.05);
}
.night-btn {
  background: #1a2744;
}
.night-btn:active {
  background: #0d1628;
}
.test-btn text {
  font-size: 24rpx;
  font-weight: 700;
  color: #fff;
}

.night .card {
  background: #667788;
  border-color: #1a2744;
}
.night .card-title {
  color: #fff;
}
.night .stat-value {
  color: #b3c5ff;
}
.night .stat-label {
  color: #aab;
}
.night .username {
  color: #ddd;
}
.night .u-head,
.night .u-body {
  background: #ddd;
}
.night .badge-name {
  color: #ccc;
}
.night .share-btn {
  background: #1a2744;
}
</style>
