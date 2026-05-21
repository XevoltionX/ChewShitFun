<template>
  <view
    class="container"
    :class="{ night: isNight }"
    :style="{ backgroundColor: isNight ? colors.night.bg : colors.day.bg }"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchCancel"
  >
    <!-- 取消区 -->
    <view class="cancel-zone" :class="{ active: recording, hovering: isOverCancel }">
      <text class="cancel-icon">❌</text>
      <text class="cancel-text">❌拖到此处取消❌</text>
    </view>

    <!-- 马桶图标（取消区和气泡之间） -->
    <view
      class="trigger-area"
      :class="{ recording: recording }"
    >
      <view class="toilet-circle" :class="{ recording: recording, pressing: isPressing }" @longpress="onLongPress" @touchstart="isPressing = true" @touchend="isPressing = false" @touchcancel="isPressing = false">
        <text class="toilet-icon">🚽</text>
      </view>
      <text class="trigger-hint" v-if="!recording">长按马桶 拉屎记录不止(松手确认)</text>
    </view>

    <!-- 气泡层叠区（马桶下方） -->
    <view class="layers-area" v-if="recording">
      <view
        v-for="(layer, li) in visibleLayers"
        :key="layer.state"
        class="layer-row"
      >
        <text class="layer-label">{{ layer.label }}</text>
        <view class="bubble-row" :class="{ current: layer.isCurrent }">
          <view
            v-for="(opt, oi) in layer.options"
            :key="opt"
            class="bubble"
            :class="{
              selected: layer.selected === opt,
              hovered: layer.isCurrent && hoveredIdx === oi,
            }"
            :style="{ background: bubbleBg(layer, opt) }"
          >
            <text class="bubble-text">{{ opt }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部取消区 -->
    <view class="cancel-zone cancel-bottom" :class="{ active: recording, hovering: isOverBottomCancel }">
      <text class="cancel-text">拖到此处取消</text>
      <text class="cancel-icon">❌</text>
    </view>

    <!-- 连线层（绝对定位） -->
    <view v-if="recording" class="lines-layer">
      <view
        v-for="(line, idx) in staticLines"
        :key="'s'+idx"
        class="connect-line"
        :style="lineStyle(line)"
      />
      <view
        v-if="fingerLine"
        class="connect-line finger-line"
        :style="lineStyle(fingerLine)"
      />
    </view>
	
    <!-- 岁月屎书 -->
    <view class="shit-log" v-if="!recording">
      <view class="shit-log-header">
        <text class="shit-log-title">📜 岁月屎书</text>
        <text class="shit-log-count">{{ doneCount }}/{{ todoList.length }}📜</text>
      </view>
      <view class="shit-log-list" v-if="todoList.length > 0" @touchmove.stop>
        <view
          v-for="item in todoList"
          :key="item.id"
          class="todo-item"
        >
          <view class="todo-check" :class="{ done: item.done }" @click="toggleTodo(item.id)">
            <text v-if="item.done">✅</text>
          </view>
          <text class="todo-text" :class="{ done: item.done }">
            {{ item.text }}
            <text class="todo-time">{{ formatTodoTime(item.createdAt) }}</text>
          </text>
          <view v-if="item.done" class="todo-del" @click="deleteTodo(item.id)">
            <text class="todo-del-icon">🗑</text>
          </view>
        </view>
      </view>
      <view class="shit-log-empty" v-else>
        <text>暂无记录，你特么就这么闲吗</text>
      </view>
      <view class="todo-input-row">
        <input
          class="todo-input"
          v-model="newTodoText"
          placeholder="记点什么..."
          placeholder-style="color: #b8a890"
          confirm-type="done"
          @confirm="addTodo"
        />
        <view class="todo-add-btn" @click="addTodo">
          <text>+</text>
        </view>
      </view>
    </view>

    <toast-notification />
    <custom-tabbar v-if="!recording" :currentTab="1" />
  </view>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { usePoopStore } from '@/stores/poop.js'
import CustomTabbar from '@/components/custom-tabbar.vue'
import { showToast } from '@/utils/toast.js'
import ToastNotification from '@/components/toast-notification.vue'
import { isNight, colors } from '@/utils/theme.js'
import { playBobo } from '@/utils/sound.js'

const poopStore = usePoopStore()

const state = ref('idle')
const recording = computed(() => state.value !== 'idle')
const isPressing = ref(false)

const layerConfig = {
  layer1: { label: '粘稠度', options: ['稀', '固液共存', '软', '石更'], key: 'consistency' },
  layer2: { label: '臭味', options: ['没啥味', '适中', '有点臭', '生化武器'], key: 'smell' },
  layer3: { label: '量', options: ['一点点', '正常量', '量很大'], key: 'amount' },
  layer4: { label: '颜色', options: ['黄绿', '浅棕', '深棕', '偏黑'], key: 'color' },
}
const layerOrder = ['layer1', 'layer2', 'layer3', 'layer4']
const defaults = { consistency: '软', smell: '适中', amount: '正常量', color: '浅棕' }

// 各选项对应浅色背景
const bubbleBgMap = {
  // 粘稠度
  '稀': '#e8f4fd',
  '固液共存': '#fef3d8',
  '软': '#f5e6d3',
  '石更': '#7d785e',
  // 颜色
  '黄绿': '#5b7424',
  '浅棕': '#f0a428',
  '深棕': '#8d6630',
  '偏黑': '#4b4b4b',
  // 臭味
  '没啥味': '#e8f5e9',
  '适中': '#ffffd5',
  '有点臭': '#daff83',
  '生化武器': '#4b680d',
  // 量
  '一点点': '#e8f0ff',
  '正常量': '#f0f5e8',
  '量很大': '#ffe6d6',
}

function bubbleBg(layer, opt) {
  if (!layer.isCurrent && !layer.selected) return '#fff'
  return bubbleBgMap[opt] || '#fff'
}

// 岁月屎书 Todo
const TODO_KEY = 'csf_todo_list'
const todoList = ref([])
const newTodoText = ref('')
const doneCount = computed(() => todoList.value.filter(t => t.done).length)

function loadTodos() {
  try {
    const data = uni.getStorageSync(TODO_KEY)
    todoList.value = data ? JSON.parse(data) : []
  } catch (e) { todoList.value = [] }
}

function saveTodos() {
  uni.setStorageSync(TODO_KEY, JSON.stringify(todoList.value))
}

function addTodo() {
  playBobo()
  const text = newTodoText.value.trim()
  if (!text) return
  todoList.value.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), text, done: false, createdAt: Date.now() })
  newTodoText.value = ''
  saveTodos()
}

function toggleTodo(id) {
  playBobo()
  const item = todoList.value.find(t => t.id === id)
  if (item) { item.done = !item.done; saveTodos() }
}

function deleteTodo(id) {
  playBobo()
  todoList.value = todoList.value.filter(t => t.id !== id)
  saveTodos()
}

function formatTodoTime(ts) {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

onMounted(() => { loadTodos(); uni.hideTabBar() })

const selections = ref({ consistency: '', smell: '', amount: '', color: '' })
const hoveredIdx = ref(-1)
const isOverCancel = ref(false)
const lastTouch = ref({ x: 0, y: 0 })
const layerChangePos = ref({ x: 0, y: 0 })
const hasMovedSinceLayerChange = ref(false)
const selectedCenters = ref([])
const hoverTimer = ref(null)
const pendingBubble = ref(-1)
const isOverBottomCancel = ref(false)
const linesOffsetY = ref(0)
const winHeight = ref(0)

const visibleLayers = computed(() => {
  const layers = []
  const currentIdx = layerOrder.indexOf(state.value)
  for (let i = 0; i < layerOrder.length; i++) {
    if (i > currentIdx) break
    const s = layerOrder[i]
    const cfg = layerConfig[s]
    layers.push({
      state: s,
      label: cfg.label,
      options: cfg.options,
      selected: selections.value[cfg.key],
      isCurrent: s === state.value,
    })
  }
  return layers
})

// 已选中气泡之间的静态连线
const staticLines = computed(() => {
  const lines = []
  for (let i = 1; i < selectedCenters.value.length; i++) {
    const prev = selectedCenters.value[i - 1]
    const curr = selectedCenters.value[i]
    lines.push({
      x1: prev.x,
      y1: prev.y,
      x2: curr.x,
      y2: curr.y,
    })
  }
  return lines
})

// 最后一个选中气泡到手指的追踪线
const fingerLine = computed(() => {
  if (selectedCenters.value.length === 0) return null
  if (state.value === 'idle') return null
  const last = selectedCenters.value[selectedCenters.value.length - 1]
  return {
    x1: last.x,
    y1: last.y,
    x2: lastTouch.value.x,
    y2: lastTouch.value.y,
  }
})

function lineStyle(line) {
  const dx = line.x2 - line.x1
  const dy = line.y2 - line.y1
  const length = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * 180 / Math.PI
  return {
    left: line.x1 + 'px',
    top: (line.y1 - linesOffsetY.value) + 'px',
    width: length + 'px',
    transform: `rotate(${angle}deg)`,
  }
}

function onLongPress(e) {
  if (state.value !== 'idle') return
  playBobo()
  state.value = 'layer1'
  selections.value = { consistency: '', smell: '', amount: '', color: '' }
  hoveredIdx.value = -1
  isOverCancel.value = false
  hasMovedSinceLayerChange.value = false
  selectedCenters.value = []
  isOverBottomCancel.value = false

  const touch = e.touches ? e.touches[0] : null
  if (touch) {
    lastTouch.value = { x: touch.pageX, y: touch.pageY }
    layerChangePos.value = { x: touch.pageX, y: touch.pageY }
  }

  const sys = uni.getSystemInfoSync()
  winHeight.value = sys.windowHeight
  nextTick(() => {
    uni.createSelectorQuery()
      .select('.lines-layer')
      .boundingClientRect()
      .exec((res) => {
        if (res[0]) linesOffsetY.value = res[0].top
      })
  })
}

function onTouchMove(e) {
  if (!recording.value) return
  const touch = e.touches && e.touches[0]
  if (!touch) return

  const px = touch.pageX
  const py = touch.pageY
  lastTouch.value = { x: px, y: py }

  isOverCancel.value = py < 80
  isOverBottomCancel.value = py > winHeight.value - 70
  if (isOverCancel.value || isOverBottomCancel.value) {
    hoveredIdx.value = -1
    return
  }

  uni.createSelectorQuery()
    .selectAll('.bubble-row.current .bubble')
    .boundingClientRect()
    .exec((res) => {
      const list = res[0] || []
      let found = -1
      for (let i = 0; i < list.length; i++) {
        const r = list[i]
        if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom) {
          found = i
          break
        }
      }
      hoveredIdx.value = found

      if (!hasMovedSinceLayerChange.value) {
        const dx = Math.abs(px - layerChangePos.value.x)
        const dy = Math.abs(py - layerChangePos.value.y)
        if (dx < 20 && dy < 20) return
        hasMovedSinceLayerChange.value = true
      }

      if (found !== -1) {
        if (pendingBubble.value !== found) {
          clearTimeout(hoverTimer.value)
          pendingBubble.value = found
          hoverTimer.value = setTimeout(() => {
            const cfg = layerConfig[state.value]
            if (cfg) {
              selectAndAdvance(cfg.options[found])
            }
          }, 250)
        }
      } else {
        clearTimeout(hoverTimer.value)
        pendingBubble.value = -1
      }
    })
}

function onTouchEnd() {
  if (!recording.value) return
  if (isOverCancel.value || isOverBottomCancel.value) {
    uni.vibrateShort()
    playBobo()
    showToast(' 炸弹已被拆除 ', { type: 'warning' })
    resetState()
    return
  }
  completeRecord()
}

function onTouchCancel() {
  if (!recording.value) return
  completeRecord()
}

function selectAndAdvance(value) {
  clearTimeout(hoverTimer.value)
  pendingBubble.value = -1
  playBobo()

  const cfg = layerConfig[state.value]
  if (!cfg) return
  const isReSelect = !!selections.value[cfg.key]
  selections.value[cfg.key] = value

  // layer4 重选时替换最后一个中心点，不新增
  if (isReSelect) {
    selectedCenters.value.pop()
  }

  nextTick(() => {
    querySelectedBubbleCenter()
  })

  const nextMap = { layer1: 'layer2', layer2: 'layer3', layer3: 'layer4' }
  const next = nextMap[state.value]

  if (next) {
    state.value = next
    hoveredIdx.value = -1
    hasMovedSinceLayerChange.value = false
    layerChangePos.value = { x: lastTouch.value.x, y: lastTouch.value.y }
  }
}

function querySelectedBubbleCenter() {
  uni.createSelectorQuery()
    .selectAll('.bubble.selected')
    .boundingClientRect()
    .exec((res) => {
      const list = res[0] || []
      if (list.length > 0) {
        const last = list[list.length - 1]
        selectedCenters.value.push({
          x: last.left + last.width / 2,
          y: last.top + last.height / 2,
        })
      }
    })
}

function completeRecord() {
  const filled = { ...defaults }
  Object.keys(selections.value).forEach(k => {
    if (selections.value[k]) filled[k] = selections.value[k]
  })

  poopStore.addRecord(filled)
  uni.vibrateShort()
  playBobo()
  showToast(' 已完成安放C4任务 ✅', { type: 'success' })
  resetState()
}

function resetState() {
  clearTimeout(hoverTimer.value)
  state.value = 'idle'
  selections.value = { consistency: '', smell: '', amount: '', color: '' }
  hoveredIdx.value = -1
  isOverCancel.value = false
  isOverBottomCancel.value = false
  selectedCenters.value = []
  pendingBubble.value = -1
}
</script>

<style scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
}

.cancel-zone {
  width: 100%;
  padding: 80rpx 0 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rpx;
  opacity: 0;
  transition: opacity 0.2s;
}
.cancel-zone.active {
  opacity: 1;
}
.cancel-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 101;
}
.cancel-zone.hovering {
  background: #ff4545;
}
.cancel-zone.hovering .cancel-icon,
.cancel-zone.hovering .cancel-text {
  color: #fff;
}
.cancel-icon {
  font-size: 36rpx;
}
.cancel-text {
  font-size: 22rpx;
  color: #ccc;
}

/* 马桶触发区（取消区下方、气泡上方） */
.trigger-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0 30rpx;
}
.trigger-area.recording {
  padding: 12rpx 0 4rpx;
}
.toilet-circle {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  border: 6rpx solid #8B5E3C;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}
.toilet-circle.pressing {
  transform: scale(1.08);
}
.toilet-circle.recording {
  width: 100rpx;
  height: 100rpx;
  background: rgba(139, 94, 60, 0.15);
  border-color: #5a3a1e;
}
.toilet-icon {
  font-size: 100rpx;
  transition: font-size 0.3s;
}
.trigger-area.recording .toilet-icon {
  font-size: 50rpx;
}
.trigger-hint {
  font-size: 26rpx;
  font-weight: 600;
  color: #999;
  margin-top: 8rpx;
}

/* 气泡层叠区 */
.layers-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 5;
  padding: 8rpx 20rpx 0;
  box-sizing: border-box;
}
.layer-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24rpx;
}
.layer-label {
  font-size: 24rpx;
  font-weight: 700;
  color: #2731ff;
  margin-bottom: 14rpx;
}
.bubble-row {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.bubble {
  width: 130rpx;
  height: 130rpx;
  border-radius: 50%;
  background: #fff;
  border: 4rpx solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.bubble.selected {
  border-color: #2731ff;
  border-width: 7rpx;
}
.bubble-row.current .bubble.hovered {
  background: #2731ff;
  border-color: #2731ff;
  transform: scale(1.1);
}
.bubble-row.current .bubble.hovered .bubble-text {
  color: #fff;
}
.bubble-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #333;
  text-align: center;
}

/* 连线 */
.lines-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}
.connect-line {
  position: absolute;
  height: 4rpx;
  background: #2731ff;
  transform-origin: 0 50%;
  border-radius: 2rpx;
}
.finger-line {
  opacity: 0.5;
}

/* 岁月屎书 */
.shit-log {
  padding: 24rpx 24rpx 100rpx;
  box-sizing: border-box;
  background: #faf5ed;
  border: 4rpx solid rgba(139, 94, 60, 0.4);
  border-radius: 20rpx;
  margin: 0 24rpx;
  width: calc(100% - 48rpx);
  transition: all 0.25s ease;
}
.shit-log:active {
  background: #e8dcc8;
  border-color: rgba(100, 60, 30, 0.6);
  border-width: 8rpx;
}
.shit-log-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16rpx;
  padding: 0 8rpx;
}
.shit-log-title {
  font-size: 30rpx;
  font-weight: 800;
  color: #693e22;
}
.shit-log-count {
  font-size: 24rpx;
  color: #8B5E3C;
}

.shit-log-list {
  border: 2rpx dashed rgba(139, 94, 60, 0.3);
  border-radius: 16rpx;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  max-height: 400rpx;
  margin-bottom: 16rpx;
}
.todo-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 20rpx;
  border-bottom: 1rpx dashed rgba(139, 94, 60, 0.2);
  transition: all 0.25s ease;
}
.todo-item:active {
  background: rgba(139, 94, 60, 0.08);
}
.todo-item:last-child {
  border-bottom: none;
}
.todo-del {
  margin-left: auto;
  padding: 4rpx;
  flex-shrink: 0;
}
.todo-del-icon {
  font-size: 36rpx;
}
.todo-time {
  font-size: 20rpx;
  color: #c8b8a8;
  margin-left: 12rpx;
}
.todo-check {
  width: 40rpx;
  height: 40rpx;
  border: 3rpx solid #8B5E3C;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 4rpx;
}
.todo-check.done {
  border-color: #8B5E3C;
}
.todo-text {
  flex: 1;
  font-size: 28rpx;
  color: #4a3520;
  font-weight: 500;
  word-break: break-all;
  overflow-wrap: break-word;
}
.todo-text.done {
  color: #b8a090;
  text-decoration: line-through;
}

.shit-log-empty {
  padding: 40rpx 20rpx;
  text-align: center;
  font-size: 26rpx;
  color: #b8a090;
  margin-bottom: 16rpx;
}

.todo-input-row {
  display: flex;
  gap: 12rpx;
  margin-top: 24rpx;
}
.todo-input {
  flex: 1;
  height: 72rpx;
  background: #faf5ed;
  border: 3rpx solid rgba(139, 94, 60, 0.3);
  border-radius: 16rpx;
  padding: 0 20rpx;
  font-size: 26rpx;
  color: #4a3520;
}
.todo-add-btn {
  width: 72rpx;
  height: 72rpx;
  background: #8B5E3C;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  transition: background-color 0.15s;
}
.todo-add-btn:active {
  background: #5a3a1e;
}

.night .shit-log {
  background: #5a6a78;
  border-color: rgba(26,39,68,0.5);
}
.night .shit-log-list {
  border-color: rgba(26,39,68,0.3);
}
.night .todo-item {
  border-bottom-color: rgba(26,39,68,0.2);
}
.night .todo-text {
  color: #ddd;
}
.night .todo-input {
  background: #5a6a78;
  color: #ddd;
  border-color: rgba(26,39,68,0.4);
}
.night .shit-log-title {
  color: #c49560;
}
.night .shit-log-count {
  color: #c49560;
}
.night .cancel-zone.active {
  color: #ccc;
}
.night .cancel-text {
  color: #aaa;
}
</style>
