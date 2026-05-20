<template>
  <view v-if="visible" class="popup-overlay" @click="close">
    <view class="popup-bubble" :style="bubbleStyle" @click.stop>
      <view class="bubble-arrow"></view>

      <view class="bubble-header">
        <text class="bubble-emoji">💩</text>
        <text class="bubble-date">{{ dateStr }}</text>
        <view class="bubble-count">
          <text class="count-text">{{ records.length }} 次</text>
        </view>
      </view>

      <view v-if="records.length > 0" class="bubble-records">
        <view v-for="(r, idx) in records" :key="r.id" class="record-item">
          <text class="record-index">第{{ ['①','②','③','④','⑤','⑥','⑦','⑧'][idx] || idx + 1 }}次</text>
          <text class="record-time">{{ formatTime(r.timestamp) }}</text>
          <text class="record-detail">{{ r.consistency }} · {{ r.smell }} · {{ r.amount }} · {{ r.color }}</text>
        </view>
      </view>
      <view v-else class="bubble-empty">
        <text>这天还没开张~</text>
      </view>

      <view class="bubble-advice" v-if="advice">
        <text>🍽 {{ advice }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { usePoopStore } from '@/stores/poop.js'

const props = defineProps({
  visible: { type: Boolean, default: false },
  dateStr: { type: String, default: '' },
  posX: { type: Number, default: 180 },
  posY: { type: Number, default: 300 },
})

const emit = defineEmits(['close'])

const poopStore = usePoopStore()

const records = computed(() => {
  if (!props.dateStr) return []
  return poopStore.getByDate(props.dateStr)
})

const advice = computed(() => {
  if (records.value.length === 0) return ''
  const count = records.value.length
  if (count >= 3) return '今天出货量有点大，是不是吃坏肚子了？'
  const latest = records.value[records.value.length - 1]
  if (latest.consistency === '偏黑' || latest.smell === '生化武器') return '蛋白质摄入该减减了，肠道都快成化工厂了'
  return '继续保持，你的肠道很爱你~'
})

const bubbleStyle = computed(() => ({
  left: `${props.posX}px`,
  top: `${props.posY}px`,
}))

function formatTime(ts) {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function close() {
  emit('close')
}
</script>

<style lang="scss" scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
}

.popup-bubble {
  position: absolute;
  background: #fff;
  border-radius: 18px;
  padding: 18px 22px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  width: 280px;
  transform: translateX(-50%);
  border: $border-width-base solid #eee;
}

.bubble-arrow {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #fff;
}

.bubble-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.bubble-emoji {
  font-size: 24px;
}

.bubble-date {
  font-size: 17px;
  font-weight: 700;
  color: $color-text;
}

.bubble-count {
  margin-left: auto;
  background: #f0e6d3;
  border-radius: 14px;
  padding: 3px 12px;
  border: $border-width-base solid #e0d0b8;
}

.count-text {
  font-size: 12px;
  font-weight: 700;
  color: $color-accent;
}

.bubble-records {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.record-item {
  background: #f9f5f0;
  border-radius: $border-radius-base;
  padding: 10px 14px;
  border: $border-width-base solid #eee;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px;
}

.record-index {
  font-size: 13px;
  font-weight: 700;
  color: $color-primary;
}

.record-time {
  font-size: 13px;
  font-weight: $font-weight-base;
  color: $color-text;
}

.record-detail {
  font-size: 12px;
  font-weight: $font-weight-base;
  color: $color-text-light;
  width: 100%;
  margin-top: 2px;
}

.bubble-empty {
  padding: 24px 0;
  text-align: center;
  font-size: 14px;
  font-weight: $font-weight-base;
  color: $color-text-light;
}

.bubble-advice {
  border-top: 2px dashed #e0d8c8;
  padding-top: 10px;
  font-size: 13px;
  font-weight: $font-weight-base;
  color: #886633;
  line-height: 1.5;
}
</style>
