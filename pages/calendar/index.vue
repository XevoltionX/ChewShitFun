<template>
  <view class="container" :class="{ night: isNight }" :style="{ backgroundColor: isNight ? colors.night.bg : colors.day.bg }">
    <!-- 今日战况卡片 -->
    <view class="today-card">
      <view class="today-header">
        <text class="today-label">{{ todayDateStr }}</text>
        <text class="today-title">今日战况</text>
      </view>
      <view class="today-grid">
        <view class="today-col">
          <text class="col-value" :style="{ color: countColor }">{{ todayRecords.length || '--' }}</text>
          <text class="col-label">💩安放次数</text>
        </view>
        <view class="today-col">
          <text class="col-value" :style="{ color: lastTimeColor }">{{ lastTimeText }}</text>
          <text class="col-label">🕐 最近一次</text>
        </view>
        <view class="today-col">
          <text class="col-value" :style="{ color: streakColor }">{{ streakDays || '--' }}</text>
          <text class="col-label">🔥 连续天数</text>
        </view>
      </view>
    </view>

    <calendar-grid @cell-click="onCellClick" />

    <!-- ShitMan 拉屎侠建议卡片 -->
    <view class="shitman-card">
      <view class="shitman-header">
        <view class="shitman-title-row">
          <text class="shitman-en">ShitMan</text>
          <text class="shitman-cn">拉屎侠</text>
        </view>
        <text class="shitman-avatar">🦸‍♂️</text>
      </view>
      <view class="shitman-advice-list" v-if="adviceItems.length > 0">
        <view v-for="(item, idx) in adviceItems" :key="idx" class="advice-row">
          <text class="advice-dim">{{ item.label }}</text>
          <text class="advice-text">{{ item.advice }}</text>
        </view>
      </view>
      <view class="shitman-empty" v-else>
        <text>你不记录美好拉屎生活，拉屎侠也对你的拉屎生涯爱莫能助！</text>
      </view>
    </view>

    <day-card-popup
      :visible="popupVisible"
      :dateStr="selectedDate"
      :posX="popupX"
      :posY="popupY"
      @close="popupVisible = false"
    />
    <toast-notification />
    <custom-tabbar :currentTab="0" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePoopStore } from '@/stores/poop.js'
import CalendarGrid from '@/components/calendar-grid.vue'
import DayCardPopup from '@/components/day-card-popup.vue'
import CustomTabbar from '@/components/custom-tabbar.vue'
import ToastNotification from '@/components/toast-notification.vue'
import solarLunar from 'solarlunar'
import { isNight, colors } from '@/utils/theme.js'

const poopStore = usePoopStore()

const today = new Date()
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

const popupVisible = ref(false)
const selectedDate = ref('')
const popupX = ref(187)
const popupY = ref(200)

const shichenList = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时']

function getShichen() {
  const h = today.getHours()
  if (h >= 23 || h < 1) return '子时'
  return shichenList[Math.floor((h + 1) / 2) % 12]
}

const todayLunar = computed(() => {
  const l = solarLunar.solar2lunar(today.getFullYear(), today.getMonth() + 1, today.getDate())
  return `${l.monthCn}${l.dayCn}`
})

const seasonMap = [
  { name: '春', emoji: '🌸', m: [1,2,3] },
  { name: '夏', emoji: '☀️', m: [4,5,6] },
  { name: '秋', emoji: '🍂', m: [7,8,9] },
  { name: '冬', emoji: '❄️', m: [10,11,12] },
]

const todaySeason = computed(() => {
  const lm = solarLunar.solar2lunar(today.getFullYear(), today.getMonth() + 1, today.getDate()).lMonth
  return seasonMap.find(s => s.m.includes(lm))
})

const todayDateStr = computed(() => {
  const s = todaySeason.value
  return `${s.emoji}${s.name} ${todayLunar.value} ${getShichen()}`
})

const todayRecords = computed(() => {
  return poopStore.getByDate(todayStr)
})

// 最近一次时间（所有记录，不限今天）
const lastTimeText = computed(() => {
  const all = poopStore.records
  if (all.length === 0) return '--'
  const latest = all.reduce((max, r) => Math.max(max, r.timestamp), 0)
  const d = new Date(latest)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
})

const lastTimeHours = computed(() => {
  const all = poopStore.records
  if (all.length === 0) return Infinity
  const latest = all.reduce((max, r) => Math.max(max, r.timestamp), 0)
  return (Date.now() - latest) / 3600000
})

// 连续天数（今天没记录时继承昨天）
const streakDays = computed(() => {
  const allDates = new Set()
  poopStore.records.forEach(r => {
    const d = new Date(r.timestamp)
    allDates.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
  })

  const todayDs = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const hasToday = allDates.has(todayDs)

  // 从今天或昨天开始往回数
  const start = new Date(today)
  if (!hasToday) start.setDate(start.getDate() - 1)

  let streak = 0
  const d = new Date(start)
  while (true) {
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (allDates.has(ds)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  return streak || 0
})

// 动态颜色
const countColor = computed(() => {
  const n = todayRecords.value.length
  if (n === 0) return '#8B5E3C'
  const colors = ['#8B5E3C', '#693e22', '#4d2a12', '#3a1e0d', '#2a1206']
  return colors[Math.min(n, colors.length - 1)]
})

const lastTimeColor = computed(() => {
  const h = lastTimeHours.value
  if (h > 12) return '#bcc5ff'
  if (h > 6) return '#8d9cff'
  if (h > 3) return '#5b6eff'
  if (h > 1) return '#3d4fff'
  return '#2731ff'
})

const streakColor = computed(() => {
  const s = streakDays.value
  if (s < 1) return '#fff9e6'
  if (s < 3) return '#ffe9b0'
  if (s < 5) return '#f5c542'
  if (s < 7) return '#e8a820'
  return '#f0a428'
})

// ShitMan 拉屎侠建议
const adviceMap = {
  consistency: {
    '稀': '便便偏稀，注意饮食清淡，少吃生冷辛辣，多吃香蕉苹果补纤维',
    '固液共存': '固态液态参半，肠道在适应期，多喝温水少喝冰饮',
    '软': '软硬适中，肠道状态良好，继续保持当前饮食习惯',
    '石更': '便便偏硬偏干，多喝水多吃蔬菜，适当运动促肠道蠕动',
  },
  smell: {
    '没啥味': '气味清淡，肠道菌群平衡，饮食结构非常健康',
    '适中': '气味正常范围，消化系统运转良好，继续保持',
    '有点臭': '有点上头，减少高蛋白高脂肪食物，多吃粗粮蔬菜',
    '生化武器': '蛋白质摄入过量！少吃红肉多吃蔬菜，肠道快成化工厂了',
  },
  amount: {
    '一点点': '出货量偏少，多吃富含膳食纤维的食物，如燕麦、红薯',
    '正常量': '份量刚好，肠道排空节奏很规律，继续保持',
    '量很大': '量有点大…是不是吃太多了？注意适量控制，分餐进食',
  },
  color: {
    '黄绿': '偏黄绿可能蔬菜摄入多或胆汁旺盛，继续观察，多吃温和食物',
    '浅棕': '颜色健康标准，肠道状态理想，继续保持',
    '深棕': '偏深，多喝水帮助代谢，适当减少咖啡和深色食物摄入',
    '偏黑': '颜色偏深偏黑，注意是否铁质摄入过多，多吃蔬果促代谢',
  },
}

const labelMap = { consistency: '粘稠度', smell: '臭味', amount: '量', color: '颜色' }

const adviceItems = computed(() => {
  const now = Date.now()
  const weekRecords = poopStore.records.filter(r => now - r.timestamp < 7 * 86400000)
  if (weekRecords.length === 0) return []

  const totalCount = weekRecords.length
  let freqAdvice = ''
  if (totalCount < 3) {
    freqAdvice = '7天不到3次，肠道节奏偏慢，多喝水多吃蔬果促排，别憋着'
  } else if (totalCount < 8) {
    freqAdvice = '频率健康范围，肠道节律正常，继续保持良好作息'
  } else if (totalCount < 15) {
    freqAdvice = '频率偏高，注意是否饮食过量或肠胃敏感，适当调整'
  } else {
    freqAdvice = '7天超14次！肠道负担太重了，建议就医咨询，减少刺激食物'
  }

  const items = [{ label: '频率', advice: freqAdvice }]

  const dims = ['consistency', 'smell', 'amount', 'color']
  dims.forEach(dim => {
    const values = weekRecords.map(r => r[dim]).filter(Boolean)
    const top = mode(values)
    items.push({
      label: labelMap[dim],
      advice: top ? (adviceMap[dim][top] || '数据不足，继续记录吧~') : '暂无数据',
    })
  })
  return items
})

function mode(arr) {
  if (arr.length === 0) return null
  const map = {}
  arr.forEach(v => { map[v] = (map[v] || 0) + 1 })
  return Object.entries(map).sort((a, b) => b[1] - a[1])[0][0]
}

onMounted(() => uni.hideTabBar())

function onCellClick({ dateStr, pos }) {
  selectedDate.value = dateStr
  if (pos && pos.x) {
    popupX.value = pos.x
    popupY.value = pos.y
  }
  popupVisible.value = true
}
</script>

<style scoped>
.container {
  background-color: #f5f5f5;
  padding: 20rpx 0 70px 0;
}

.today-card {
  margin: 5rpx 20rpx 0;
  background: rgba(200, 215, 255, 0.4);
  border: 6rpx solid rgba(39, 49, 255, 0.25);
  border-radius: 20rpx;
  padding: 24rpx 28rpx;
  transition: all 0.3s ease;
}
.today-card:active {
  background: rgba(160, 185, 240, 0.6);
  border-color: rgba(15, 20, 200, 0.5);
  border-width: 10rpx;
}

.today-card:active .col-value,
.today-card:active .today-title,
.today-card:active .today-label {
  font-weight: 900;
  transform: scale(1.03);
}
.today-header {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid rgba(39, 49, 255, 0.15);
}
.today-label {
  font-size: 24rpx;
  font-weight: 600;
  color: #2731ff;
}
.today-title {
  font-size: 30rpx;
  font-weight: 800;
  color: #333;
}

.today-grid {
  display: flex;
  justify-content: space-around;
}
.today-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  min-width: 120rpx;
  padding: 0 40rpx;
  border-left: 2rpx dashed rgba(39, 49, 255, 0.2);
}
.today-col:first-child {
  border-left: none;
}
.col-value {
  font-size: 40rpx;
  font-weight: 800;
}
.col-label {
  font-size: 22rpx;
  color: #888;
}

/* ShitMan 拉屎侠 */
.shitman-card {
  margin: 20rpx 20rpx 0;
  background: #faf5ed;
  border: 4rpx solid rgba(139, 94, 60, 0.4);
  border-radius: 20rpx;
  padding: 24rpx 28rpx;
  transition: all 0.25s ease;
}
.shitman-card:active {
  background: #e8dcc8;
  border-color: rgba(100, 60, 30, 0.6);
  border-width: 8rpx;
}
.shitman-card:active .shitman-en,
.shitman-card:active .shitman-cn,
.shitman-card:active .advice-dim {
  font-weight: 900;
  transform: scale(1.03);
}
.shitman-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.shitman-title-row {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
}
.shitman-en {
  font-size: 34rpx;
  font-weight: 800;
  color: #693e22;
}
.shitman-cn {
  font-size: 22rpx;
  font-weight: 600;
  color: #4a2a14;
}
.shitman-avatar {
  font-size: 44rpx;
}
.shitman-empty {
  text-align: center;
  padding: 32rpx 0;
  font-size: 26rpx;
  color: #b8a090;
  line-height: 1.6;
}

.shitman-advice-list {
  display: flex;
  flex-direction: column;
}
.advice-row {
  padding: 18rpx 0;
  border-top: 1rpx solid rgba(139, 94, 60, 0.12);
}
.advice-dim {
  font-size: 22rpx;
  font-weight: 700;
  color: #693e22;
  margin-right: 10rpx;
}
.advice-text {
  font-size: 24rpx;
  color: #3a2510;
  line-height: 1.6;
}

.night .today-card {
  background: rgba(26, 39, 68, 0.4);
  border-color: rgba(255,255,255,0.1);
}
.night .today-title {
  color: #ddd;
}
.night .col-label {
  color: #aab;
}
.night .shitman-card {
  background: #5a6a78;
  border-color: rgba(26,39,68,0.4);
}
.night .shitman-en {
  color: #c49560;
}
.night .shitman-cn {
  color: #a08060;
}
.night .advice-dim {
  color: #c49560;
}
.night .advice-text {
  color: #ddd5c8;
}
.night .bubble-text {
  /* handled inline */
}
</style>
