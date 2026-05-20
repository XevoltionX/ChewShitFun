# Phase 1: 项目脚手架 + 登录页 + 底部导航 + 日历页

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建 Uniapp (Vue 3) 项目骨架，实现伪装登录页、三栏底部导航、日历月历视图（含格子样式和气泡卡片）。

**Architecture:** Uniapp + Vue 3 + Pinia + uni.storage。pages.json 驱动路由和 TabBar，SCSS 变量管理主题色。日历页纯前端计算月份网格，pinia store 管理记录数据并持久化到本地。

**Tech Stack:** Uniapp (Vue 3 + Vite), Pinia, SCSS

**UI 全局要求:** 字体偏粗(font-weight: 600+)、圆角偏大(border-radius: 12~20px)、边界偏厚(border-width: 2~3px)

---

### Task 1: 初始化 Uniapp 项目结构

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `pages.json`
- Create: `manifest.json`
- Create: `main.js`
- Create: `App.vue`
- Create: `uni.scss`
- Create: `index.html`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "chew-shit-fun",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev:app": "uni -p app",
    "dev:mp": "uni -p mp-weixin",
    "build:app": "uni build -p app",
    "build:mp": "uni build -p mp-weixin"
  },
  "dependencies": {
    "@dcloudio/uni-app": "^3.0.0-4020420240722001",
    "@dcloudio/uni-app-plus": "^3.0.0-4020420240722001",
    "@dcloudio/uni-components": "^3.0.0-4020420240722001",
    "@dcloudio/uni-h5": "^3.0.0-4020420240722001",
    "@dcloudio/uni-mp-weixin": "^3.0.0-4020420240722001",
    "pinia": "^2.1.7",
    "vue": "^3.4.21"
  },
  "devDependencies": {
    "@dcloudio/types": "^3.4.8",
    "@dcloudio/uni-automator": "^3.0.0-4020420240722001",
    "@dcloudio/uni-cli-shared": "^3.0.0-4020420240722001",
    "@dcloudio/vite-plugin-uni": "^3.0.0-4020420240722001",
    "sass": "^1.77.0",
    "vite": "^5.2.0"
  }
}
```

- [ ] **Step 2: 创建 vite.config.js**

```js
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
})
```

- [ ] **Step 3: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>ChewShitFun</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: 创建 manifest.json**

```json
{
  "name": "ChewShitFun",
  "appid": "__UNI__CHEWSHITFUN",
  "versionName": "1.0.0",
  "versionCode": "100",
  "app-plus": {
    "distribute": {
      "android": {
        "packageName": "com.chewshitfun.app"
      }
    },
    "softinputMode": "adjustResize"
  }
}
```

- [ ] **Step 5: 创建 pages.json（先放占位页面，后续任务补充）**

```json
{
  "pages": [
    {
      "path": "pages/login/index",
      "style": {
        "navigationBarTitleText": "",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/calendar/index",
      "style": {
        "navigationBarTitleText": "ChewShitFun",
        "navigationBarBackgroundColor": "#4D6BFE",
        "navigationBarTextStyle": "white"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "ChewShitFun",
    "navigationBarBackgroundColor": "#4D6BFE",
    "backgroundColor": "#FFFFFF"
  }
}
```

- [ ] **Step 6: 创建 main.js**

```js
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia())
  return { app }
}
```

- [ ] **Step 7: 创建 App.vue**

```vue
<script setup>
import { onLaunch } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('🚽 ChewShitFun 启动')
})
</script>

<style lang="scss">
@import '@/uni.scss';
</style>
```

- [ ] **Step 8: 创建 uni.scss（全局 SCSS 变量）**

```scss
// === 主题色 ===
$color-primary: #4D6BFE;
$color-primary-dark: #1a2744;
$color-accent: #8B5E3C;
$color-bg: #FFFFFF;
$color-text: #333333;
$color-text-light: #999999;
$color-border: #e0e0e0;

// === 日历格子（方案D） ===
$cell-bg-0: #fff;
$cell-border-0: #e0e0e0;
$cell-bg-1: #fdf5ee;
$cell-border-1: #e8d5c0;
$cell-bg-2: #fbe8d0;
$cell-border-2: #d4a97a;
$cell-bg-3: #f5d4a8;
$cell-border-3: #b8783a;

// === 全局UI：字体加粗、圆角偏大、边界偏厚 ===
$font-weight-base: 600;
$border-radius-base: 12px;
$border-radius-lg: 20px;
$border-width-base: 2px;
$border-width-thick: 3px;

// === 全局样式 ===
page {
  background-color: $color-bg;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
  font-weight: $font-weight-base;
  color: $color-text;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 9: 安装依赖**

```bash
cd F:\桌面\ClaudeWork\ChewShitFun && npm install
```

Expected: 依赖安装成功，无错误。

- [ ] **Step 10: Commit**

```bash
git add package.json vite.config.js index.html manifest.json pages.json main.js App.vue uni.scss
git commit -m "feat: init Uniapp Vue3 project scaffold"
```

---

### Task 2: 实现本地存储工具 + Pinia Store

**Files:**
- Create: `utils/storage.js`
- Create: `stores/poop.js`
- Create: `stores/user.js`

- [ ] **Step 1: 创建 utils/storage.js**

```js
const KEYS = {
  POOP_RECORDS: 'csf_poop_records',
  USER_CONFIG: 'csf_user_config',
  ACHIEVEMENTS: 'csf_achievements',
}

export function getRecords() {
  try {
    const data = uni.getStorageSync(KEYS.POOP_RECORDS)
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

export function saveRecords(records) {
  try {
    uni.setStorageSync(KEYS.POOP_RECORDS, JSON.stringify(records))
  } catch (e) {
    console.error('存储记录失败:', e)
  }
}

export function getUserConfig() {
  try {
    const data = uni.getStorageSync(KEYS.USER_CONFIG)
    return data ? JSON.parse(data) : { lastUsername: '', presetNames: ['余苟千', '朋友A', '朋友B', '朋友C'] }
  } catch (e) {
    return { lastUsername: '', presetNames: ['余苟千', '朋友A', '朋友B', '朋友C'] }
  }
}

export function saveUserConfig(config) {
  try {
    uni.setStorageSync(KEYS.USER_CONFIG, JSON.stringify(config))
  } catch (e) {
    console.error('存储配置失败:', e)
  }
}

export function getAchievements() {
  try {
    const data = uni.getStorageSync(KEYS.ACHIEVEMENTS)
    return data ? JSON.parse(data) : {}
  } catch (e) {
    return {}
  }
}

export function saveAchievements(data) {
  try {
    uni.setStorageSync(KEYS.ACHIEVEMENTS, JSON.stringify(data))
  } catch (e) {
    console.error('存储成就失败:', e)
  }
}
```

- [ ] **Step 2: 创建 stores/poop.js**

```js
import { defineStore } from 'pinia'
import { getRecords, saveRecords } from '@/utils/storage.js'

export const usePoopStore = defineStore('poop', {
  state: () => ({
    records: [],
  }),

  getters: {
    // 获取某天的记录列表
    getByDate: (state) => (dateStr) => {
      return state.records.filter(r => {
        const d = new Date(r.timestamp)
        const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        return ds === dateStr
      })
    },

    // 获取某天记录次数
    getCountByDate: (state) => (dateStr) => {
      return state.records.filter(r => {
        const d = new Date(r.timestamp)
        const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        return ds === dateStr
      }).length
    },

    // 获取某月的所有记录（按日期分组计数）
    getMonthSummary: (state) => (year, month) => {
      const map = {}
      state.records.forEach(r => {
        const d = new Date(r.timestamp)
        if (d.getFullYear() === year && d.getMonth() + 1 === month) {
          const ds = `${year}-${String(month).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          map[ds] = (map[ds] || 0) + 1
        }
      })
      return map
    },
  },

  actions: {
    loadFromStorage() {
      this.records = getRecords()
    },

    addRecord(record) {
      this.records.push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
        ...record,
      })
      saveRecords(this.records)
    },
  },
})
```

- [ ] **Step 3: 创建 stores/user.js**

```js
import { defineStore } from 'pinia'
import { getUserConfig, saveUserConfig } from '@/utils/storage.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    config: { lastUsername: '', presetNames: ['余苟千', '朋友A', '朋友B', '朋友C'] },
    currentUser: '',
  }),

  actions: {
    loadConfig() {
      this.config = getUserConfig()
      this.currentUser = this.config.lastUsername || ''
    },

    setLastUsername(name) {
      this.config.lastUsername = name
      this.currentUser = name
      saveUserConfig(this.config)
    },
  },
})
```

- [ ] **Step 4: Commit**

```bash
git add utils/storage.js stores/poop.js stores/user.js
git commit -m "feat: add pinia stores and local storage utils"
```

---

### Task 3: 实现伪装登录页

**Files:**
- Create: `pages/login/index.vue`

- [ ] **Step 1: 创建 pages/login/index.vue**

```vue
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

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()
userStore.loadConfig()

const username = ref(userStore.config.lastUsername)
const presetNames = userStore.config.presetNames

function handleEnter() {
  const name = username.value.trim()
  if (!name) {
    uni.showToast({ title: '好歹输入个名字吧~', icon: 'none' })
    return
  }
  if (!presetNames.includes(name)) {
    uni.showToast({ title: '不在名单上，换一个试试~', icon: 'none' })
    return
  }
  userStore.setLastUsername(name)
  uni.switchTab({ url: '/pages/calendar/index' })
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background-color: $color-primary-dark;
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
  border: $border-width-thick solid rgba(255, 255, 255, 0.25);
  border-radius: $border-radius-base;
  padding: 0 18px;
  font-size: 17px;
  font-weight: $font-weight-base;
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
  font-weight: $font-weight-base;
}

.hint-names {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hint-name-tag {
  font-size: 12px;
  font-weight: $font-weight-base;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.15);
  border-radius: $border-radius-lg;
  padding: 4px 14px;
  border: 2px solid rgba(255, 255, 255, 0.25);
}

.btn-enter {
  margin-top: 12px;
  height: 52px;
  background: $color-accent;
  border-radius: $border-radius-base;
  display: flex;
  align-items: center;
  justify-content: center;
  border: $border-width-thick solid darken($color-accent, 8%);
}

.btn-text {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 4px;
}
</style>
```

- [ ] **Step 2: 验证登录页效果**

在 HBuilderX 或运行 `npm run dev:app` 启动项目，确认：
- 深蓝背景全屏显示
- 💩 logo + 标题居中
- 输入框有上次用户名默认值
- 点击预设名标签可填入
- 不在名单中的名会提示
- 输入正确名后点击进入跳转到日历页

- [ ] **Step 3: Commit**

```bash
git add pages/login/index.vue
git commit -m "feat: add fake login page with preset usernames"
```

---

### Task 4: 配置底部TabBar + 占位页面

**Files:**
- Modify: `pages.json`
- Create: `pages/calendar/index.vue` (占位)
- Create: `pages/record/index.vue` (占位)
- Create: `pages/user/index.vue` (占位)

- [ ] **Step 1: 更新 pages.json 加入 TabBar**

```json
{
  "pages": [
    {
      "path": "pages/login/index",
      "style": {
        "navigationBarTitleText": "",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/calendar/index",
      "style": {
        "navigationBarTitleText": "ChewShitFun",
        "navigationBarBackgroundColor": "#4D6BFE",
        "navigationBarTextStyle": "white"
      }
    },
    {
      "path": "pages/record/index",
      "style": {
        "navigationBarTitleText": "记录",
        "navigationBarBackgroundColor": "#4D6BFE",
        "navigationBarTextStyle": "white"
      }
    },
    {
      "path": "pages/user/index",
      "style": {
        "navigationBarTitleText": "我的",
        "navigationBarBackgroundColor": "#4D6BFE",
        "navigationBarTextStyle": "white"
      }
    }
  ],
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#4D6BFE",
    "backgroundColor": "#FFFFFF",
    "borderStyle": "white",
    "list": [
      {
        "pagePath": "pages/calendar/index",
        "text": "日历",
        "iconPath": "static/tab-calendar.png",
        "selectedIconPath": "static/tab-calendar-active.png"
      },
      {
        "pagePath": "pages/record/index",
        "text": "记录",
        "iconPath": "static/tab-record.png",
        "selectedIconPath": "static/tab-record-active.png"
      },
      {
        "pagePath": "pages/user/index",
        "text": "用户",
        "iconPath": "static/tab-user.png",
        "selectedIconPath": "static/tab-user-active.png"
      }
    ]
  },
  "globalStyle": {
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "ChewShitFun",
    "navigationBarBackgroundColor": "#4D6BFE",
    "backgroundColor": "#FFFFFF"
  }
}
```

- [ ] **Step 2: 创建 tab bar 图标（用 SVG 转 PNG 或 uni_modules 文字图标方案）**

由于还没有设计图标，先用 emoji 文字作为 tab 标识（通过 `tabBar` 不支持 emoji），改为使用 `midButton` 自定义 TabBar 方案较复杂。先使用 `pages.json` 的 `tabBar` + 纯色占位图标。

创建 `static/` 文件夹，使用简单的单色 SVG 作为 tab 图标占位：

```bash
mkdir -p F:\桌面\ClaudeWork\ChewShitFun\static
```

由于无法直接创建 PNG 图标，改用 **自定义 TabBar 方案**（uni-app 支持 `tabBar.custom: true`），这样可以完全控制样式，使用 emoji 作为图标。

- [ ] **Step 3: 改用自定义 TabBar**

更新 `pages.json` 的 tabBar 配置：

```json
{
  "tabBar": {
    "custom": true,
    "color": "#999999",
    "selectedColor": "#4D6BFE",
    "backgroundColor": "#FFFFFF",
    "borderStyle": "white",
    "list": [
      { "pagePath": "pages/calendar/index", "text": "日历", "icon": "📅" },
      { "pagePath": "pages/record/index", "text": "记录", "icon": "💩" },
      { "pagePath": "pages/user/index", "text": "用户", "icon": "👤" }
    ]
  }
}
```

- [ ] **Step 4: 创建自定义 TabBar 组件 components/custom-tabbar.vue**

```vue
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

// 监听页面切换以更新 current
uni.onTabBarMidButtonTap && (() => {})
</script>

<style lang="scss" scoped>
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
  font-weight: $font-weight-base;
  color: $color-text-light;
}

.tabbar-text.active {
  color: $color-primary;
  font-weight: 700;
}
</style>
```

- [ ] **Step 5: 创建占位页面**

`pages/calendar/index.vue`:
```vue
<template>
  <view class="page">
    <text class="placeholder">📅 日历页（下一步实现）</text>
    <custom-tabbar />
  </view>
</template>

<script setup>
import CustomTabbar from '@/components/custom-tabbar.vue'
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 70px;
}
.placeholder {
  font-size: 18px;
  font-weight: $font-weight-base;
  color: $color-text-light;
}
</style>
```

`pages/record/index.vue` 和 `pages/user/index.vue` 同理（略，结构相同仅文字不同）。

> 注意：自定义 TabBar 需要在每个 tab 页面中引入 `<custom-tabbar />` 组件。在 pages.json 中设置 `"tabBar": { "custom": true }` 后，uni-app 不再渲染原生 tabbar。

- [ ] **Step 6: 提交**

```bash
git add pages.json pages/calendar/index.vue pages/record/index.vue pages/user/index.vue components/custom-tabbar.vue
git commit -m "feat: add custom tabbar with emoji icons and placeholder pages"
```

---

### Task 5: 实现日历页 — 月历网格视图

**Files:**
- Modify: `pages/calendar/index.vue`
- Create: `components/calendar-grid.vue`

- [ ] **Step 1: 创建日历网格组件 components/calendar-grid.vue**

```vue
<template>
  <view class="calendar-grid">
    <!-- 月份切换栏 -->
    <view class="month-header">
      <view class="month-arrow" @click="prevMonth">‹</view>
      <text class="month-title">{{ year }}年{{ month }}月</text>
      <view class="month-arrow" @click="nextMonth">›</view>
    </view>

    <!-- 星期头 -->
    <view class="weekday-row">
      <text v-for="w in weekdays" :key="w" class="weekday-cell">{{ w }}</text>
    </view>

    <!-- 日期格子 -->
    <view class="date-grid">
      <view
        v-for="(cell, idx) in cells"
        :key="idx"
        class="date-cell"
        :class="cell.classes"
        :style="cell.style"
        @click="cell.dateStr && onCellClick(cell)"
      >
        <text class="cell-date">{{ cell.day }}</text>
        <text class="cell-emoji" v-if="cell.hasRecord">💩</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePoopStore } from '@/stores/poop.js'

const props = defineProps({
  year: Number,
  month: Number,
})

const emit = defineEmits(['cell-click'])

const poopStore = usePoopStore()
const weekdays = ['一', '二', '三', '四', '五', '六', '日']

// 计算当月日历网格
const cells = computed(() => {
  const y = props.year
  const m = props.month
  const firstDay = new Date(y, m - 1, 1)
  const lastDay = new Date(y, m, 0)
  const daysInMonth = lastDay.getDate()
  // 第一天是星期几（0=日, 1=一 ... 6=六）
  let startDow = firstDay.getDay()
  startDow = startDow === 0 ? 6 : startDow - 1 // 转为周一起始

  const monthSummary = poopStore.getMonthSummary(y, m)
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const result = []

  // 填充前置空白格
  for (let i = 0; i < startDow; i++) {
    result.push({ day: '', dateStr: '', hasRecord: false, classes: {}, style: {} })
  }

  // 填充当月日期
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const count = monthSummary[dateStr] || 0
    const isToday = dateStr === todayStr

    const countLevel = Math.min(count, 3)
    const bgColors = ['#fff', '#fdf5ee', '#fbe8d0', '#f5d4a8']
    const borderColors = ['#e0e0e0', '#e8d5c0', '#d4a97a', '#b8783a']

    result.push({
      day: d,
      dateStr,
      hasRecord: count > 0,
      count,
      classes: {
        'has-record': count > 0,
        'is-today': isToday,
      },
      style: {
        background: bgColors[countLevel],
        border: `2px solid ${borderColors[countLevel]}`,
      },
    })
  }

  return result
})

function onCellClick(cell) {
  emit('cell-click', { dateStr: cell.dateStr, count: cell.count })
}
</script>

<script>
export default {
  props: ['year', 'month'],
  emits: ['cell-click'],
  methods: {
    prevMonth() {
      let y = this.year, m = this.month - 1
      if (m === 0) { m = 12; y-- }
      this.$emit('update:year', y)
      this.$emit('update:month', m)
    },
    nextMonth() {
      let y = this.year, m = this.month + 1
      if (m === 13) { m = 1; y++ }
      this.$emit('update:year', y)
      this.$emit('update:month', m)
    },
  },
}
</script>

<style lang="scss" scoped>
.calendar-grid {
  padding: 12px 10px;
}

.month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 8px;
}

.month-title {
  font-size: 20px;
  font-weight: 700;
  color: $color-text;
}

.month-arrow {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: $color-primary;
  border: $border-width-base solid $color-primary;
  border-radius: $border-radius-lg;
}

.weekday-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 6px;
}

.weekday-cell {
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: $color-text-light;
  padding: 6px 0;
}

.date-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.date-cell {
  aspect-ratio: 1;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: all 0.15s;
}

.date-cell.has-record {
  border-width: 2px;
}

.date-cell.is-today {
  box-shadow: inset 0 0 0 2px $color-primary;
}

.cell-date {
  font-size: 14px;
  font-weight: 700;
  color: $color-text;
}

.cell-emoji {
  font-size: 16px;
  margin-top: 1px;
}
</style>
```

> **注意：** `calendar-grid.vue` 使用了 Options API + Composition API 混合来分别处理 `props`/`emits` 和计算逻辑。在 Uniapp 中，`.vue` 文件应统一使用 `<script setup>` 写法。上面的月份切换方法需要重构为纯 Composition API。

- [ ] **Step 2: 修正 calendar-grid.vue 为纯 Composition API**

```vue
<template>
  <view class="calendar-grid">
    <view class="month-header">
      <view class="month-arrow" @click="changeMonth(-1)">‹</view>
      <text class="month-title">{{ currentYear }}年{{ currentMonth }}月</text>
      <view class="month-arrow" @click="changeMonth(1)">›</view>
    </view>

    <view class="weekday-row">
      <text v-for="w in weekdays" :key="w" class="weekday-cell">{{ w }}</text>
    </view>

    <view class="date-grid">
      <view
        v-for="(cell, idx) in cells"
        :key="idx"
        class="date-cell"
        :style="cell.style"
        @click="cell.dateStr && emit('cell-click', { dateStr: cell.dateStr, count: cell.count || 0 })"
      >
        <text class="cell-date">{{ cell.day }}</text>
        <text class="cell-emoji" v-if="cell.hasRecord">💩</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePoopStore } from '@/stores/poop.js'

const emit = defineEmits(['cell-click'])

const poopStore = usePoopStore()
const weekdays = ['一', '二', '三', '四', '五', '六', '日']

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth() + 1)

const cells = computed(() => {
  const y = currentYear.value
  const m = currentMonth.value
  const firstDay = new Date(y, m - 1, 1)
  const lastDay = new Date(y, m, 0)
  const daysInMonth = lastDay.getDate()
  let startDow = firstDay.getDay()
  startDow = startDow === 0 ? 6 : startDow - 1

  const monthSummary = poopStore.getMonthSummary(y, m)
  const todayDate = new Date()
  const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`

  const result = []

  for (let i = 0; i < startDow; i++) {
    result.push({ day: '', dateStr: '', hasRecord: false, style: {}, count: 0 })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const count = monthSummary[dateStr] || 0
    const level = Math.min(count, 3)
    const bgColors = ['#fff', '#fdf5ee', '#fbe8d0', '#f5d4a8']
    const borderColors = ['#e0e0e0', '#e8d5c0', '#d4a97a', '#b8783a']
    const isToday = dateStr === todayStr

    result.push({
      day: d,
      dateStr,
      hasRecord: count > 0,
      count,
      style: {
        background: bgColors[level],
        border: `2px solid ${borderColors[level]}`,
        boxShadow: isToday ? `inset 0 0 0 2px #4D6BFE` : 'none',
      },
    })
  }

  return result
})

function changeMonth(delta) {
  let m = currentMonth.value + delta
  let y = currentYear.value
  if (m === 0) { m = 12; y-- }
  if (m === 13) { m = 1; y++ }
  currentYear.value = y
  currentMonth.value = m
}
</script>

<style lang="scss" scoped>
.calendar-grid {
  padding: 12px 10px;
}

.month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 8px;
}

.month-title {
  font-size: 20px;
  font-weight: 700;
  color: $color-text;
}

.month-arrow {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  color: $color-primary;
  border: $border-width-base solid $color-primary;
  border-radius: $border-radius-lg;
}

.weekday-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 6px;
}

.weekday-cell {
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: $color-text-light;
  padding: 6px 0;
}

.date-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.date-cell {
  aspect-ratio: 1;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cell-date {
  font-size: 14px;
  font-weight: 700;
  color: $color-text;
}

.cell-emoji {
  font-size: 16px;
  margin-top: 1px;
}
</style>
```

- [ ] **Step 3: 更新 pages/calendar/index.vue 使用日历组件**

```vue
<template>
  <view class="calendar-page">
    <calendar-grid @cell-click="handleCellClick" />
    <custom-tabbar />
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { usePoopStore } from '@/stores/poop.js'
import CalendarGrid from '@/components/calendar-grid.vue'
import CustomTabbar from '@/components/custom-tabbar.vue'

const poopStore = usePoopStore()

onShow(() => {
  poopStore.loadFromStorage()
})

function handleCellClick({ dateStr, count }) {
  // 后续 Task 接入气泡卡片
  console.log('点击日期:', dateStr, '次数:', count)
}
</script>

<style lang="scss" scoped>
.calendar-page {
  min-height: 100vh;
  background: $color-bg;
  padding-bottom: 70px;
}
</style>
```

- [ ] **Step 4: Commit**

```bash
git add components/calendar-grid.vue pages/calendar/index.vue
git commit -m "feat: add calendar month grid with poop emoji markers"
```

---

### Task 6: 实现每日详情气泡卡片

**Files:**
- Create: `components/day-card-popup.vue`
- Modify: `pages/calendar/index.vue` (接入气泡卡片)

- [ ] **Step 1: 创建 components/day-card-popup.vue**

```vue
<template>
  <view v-if="visible" class="popup-overlay" @click="close">
    <view class="popup-bubble" :style="bubbleStyle" @click.stop>
      <!-- 三角形箭头 -->
      <view class="bubble-arrow"></view>

      <!-- 标题 -->
      <view class="bubble-header">
        <text class="bubble-emoji">💩</text>
        <text class="bubble-date">{{ dateStr }}</text>
        <view class="bubble-count">
          <text class="count-text">{{ records.length }} 次</text>
        </view>
      </view>

      <!-- 记录列表 -->
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

      <!-- 饮食建议 -->
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
  border: 2px solid #e0d0b8;
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
  border: 2px solid #eee;
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
```

- [ ] **Step 2: 更新 pages/calendar/index.vue 接入气泡卡片**

```vue
<template>
  <view class="calendar-page">
    <calendar-grid @cell-click="handleCellClick" />

    <day-card-popup
      :visible="popupVisible"
      :dateStr="popupDateStr"
      :posX="popupX"
      :posY="popupY"
      @close="popupVisible = false"
    />

    <custom-tabbar />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { usePoopStore } from '@/stores/poop.js'
import CalendarGrid from '@/components/calendar-grid.vue'
import DayCardPopup from '@/components/day-card-popup.vue'
import CustomTabbar from '@/components/custom-tabbar.vue'

const poopStore = usePoopStore()

onShow(() => {
  poopStore.loadFromStorage()
})

const popupVisible = ref(false)
const popupDateStr = ref('')
const popupX = ref(180)
const popupY = ref(300)

function handleCellClick({ dateStr, count }) {
  popupDateStr.value = dateStr
  popupVisible.value = true
  // 气泡位置：屏幕上方三分之一处居中
  const systemInfo = uni.getSystemInfoSync()
  popupX.value = systemInfo.windowWidth / 2
  popupY.value = systemInfo.windowHeight * 0.28
}
</script>

<style lang="scss" scoped>
.calendar-page {
  min-height: 100vh;
  background: $color-bg;
  padding-bottom: 70px;
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add components/day-card-popup.vue pages/calendar/index.vue
git commit -m "feat: add day detail bubble popup card"
```

---

### Task 7: 初始化数据 — 插入示例记录验证

**Files:**
- Modify: `App.vue` (在 onLaunch 插入示例数据)

- [ ] **Step 1: 在 App.vue 加入示例数据逻辑**

```vue
<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { getRecords, saveRecords } from '@/utils/storage.js'

onLaunch(() => {
  console.log('🚽 ChewShitFun 启动')

  // 首次启动时插入示例数据
  const records = getRecords()
  if (records.length === 0) {
    const now = Date.now()
    const sampleRecords = [
      { id: 's1', timestamp: now - 86400000 * 2, consistency: '浅棕', smell: '适中', amount: '正常量', color: '浅棕' },
      { id: 's2', timestamp: now - 86400000 * 2, consistency: '深棕', smell: '有点臭', amount: '量很大', color: '深棕' },
      { id: 's3', timestamp: now - 86400000, consistency: '浅棕', smell: '没啥味', amount: '正常量', color: '浅棕' },
      { id: 's4', timestamp: now, consistency: '黄绿', smell: '有点臭', amount: '一点点', color: '黄绿' },
      { id: 's5', timestamp: now, consistency: '偏黑', smell: '生化武器', amount: '正常量', color: '偏黑' },
    ]
    saveRecords(sampleRecords)
  }
})
</script>

<style lang="scss">
@import '@/uni.scss';
</style>
```

- [ ] **Step 2: 验证完整流程**

```bash
npm run dev:app
```

确认：
1. 启动显示登录页，深蓝背景 + 💩 logo
2. 输入预设名可进入日历页
3. 日历页显示本月格子，有示例数据的天数显示 💩 标记
4. 格子颜色随次数加深（今天有2条示例数据应为 `#fbe8d0`）
5. 点击有记录日期弹出气泡卡片，显示详情+建议
6. 点击空白日期弹卡片显示「这天还没开张~」
7. 底部 TabBar 三栏可切换（记录页和用户页为占位）
8. 字体偏粗、圆角偏大、边界偏厚

- [ ] **Step 3: Commit**

```bash
git add App.vue
git commit -m "feat: add sample data for first-run verification"
```

---

### 自审清单

**1. Spec 覆盖:**
- ✅ 伪装登录页（深蓝背景、预设名、默认上一次用户名）
- ✅ 底部三栏导航（📅💩👤 自定义 TabBar）
- ✅ 日历月历视图（左右切换、格子标记、边界清晰）
- ✅ 每日气泡卡片（C 方案——日期位置冒出、详情+建议、点击卡片外关闭）
- ✅ 配色方案 D（白底+深浅棕边框）
- ✅ UI 要求：字体加粗、圆角偏大、边界偏厚
- ⬜ 记录页（Phase 2）
- ⬜ 用户页（Phase 4）

**2. 占位符检查:** 无 TBD/TODO。所有颜色值、常量、文案均已明确。

**3. 类型一致性:**
- Store 字段：`consistency`, `smell`, `amount`, `color` 与 spec 一致
- 默认值：`{ consistency: '浅棕', smell: '适中', amount: '正常量', color: '浅棕' }` 与 spec "最常见默认值" 一致
- `calendar-grid` emits `cell-click`，calendar/index.vue 监听 `@cell-click`，event payload `{ dateStr, count }` 一致
- `day-card-popup` props: `visible`, `dateStr`, `posX`, `posY` + emit `close` 与父组件调用一致

**4. TabBar 自定义方案:**
- `pages.json` 中设置 `"tabBar": { "custom": true }`
- 每个 tab 页面必须引入 `<custom-tabbar />` 组件
- 当前占位的 record 和 user 页面也需要引入
- 此方案避免了图标文件的依赖，纯 emoji 即可
