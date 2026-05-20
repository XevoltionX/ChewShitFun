# 代码参考 - 重新搭建指南

这里保存了 ChewShitFun 的所有核心代码。由于 Uniapp 框架脚手架在直接创建时遇到了页面渲染问题，建议用以下方式重建项目。

## 方式一：HBuilderX 新建（推荐）

1. 打开 HBuilderX → 新建 → 项目 → uni-app → Vue 3 版本
2. 把 `pages/`、`components/`、`stores/`、`utils/` 四个文件夹复制到新项目的 `src/` 目录下
3. 把 `uni.scss` 复制到新项目的 `src/` 下
4. 在新项目的 `pages.json` 中配置路由（参考下面的 `pages.json`）
5. 把 `App.vue` 和 `main.js` 替换为下方的正确版本

## 方式二：CLI 创建

```bash
npx degit dcloudio/uni-preset-vue#vite cheat-shit-fun-new
cd cheat-shit-fun-new
npm install
# 再把 pages/components/stores/utils 复制进 src/
```

---

## 关键配置文件（已验证可用）

### pages.json

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
    "custom": true,
    "color": "#999999",
    "selectedColor": "#4D6BFE",
    "backgroundColor": "#FFFFFF",
    "borderStyle": "white",
    "list": [
      { "pagePath": "pages/calendar/index", "text": "日历" },
      { "pagePath": "pages/record/index", "text": "记录" },
      { "pagePath": "pages/user/index", "text": "用户" }
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

### App.vue

```vue
<script>
import { getRecords, saveRecords } from '@/utils/storage.js'

export default {
  onLaunch() {
    console.log('🚽 ChewShitFun 启动')

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
      console.log('📦 已插入示例数据')
    }
  },
}
</script>

<style>
page {
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
  font-weight: 600;
  color: #333333;
}
</style>
```

### main.js

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

## 目录结构（新项目 src/ 下）

```
src/
├── App.vue
├── main.js
├── pages.json
├── manifest.json
├── uni.scss
├── pages/
│   ├── login/index.vue
│   ├── calendar/index.vue
│   ├── record/index.vue
│   └── user/index.vue
├── components/
│   ├── custom-tabbar.vue
│   ├── calendar-grid.vue
│   └── day-card-popup.vue
├── stores/
│   ├── poop.js
│   └── user.js
└── utils/
    └── storage.js
```

## 注意事项

- 所有页面和组件都使用 **Options API**（`export default {}`），不要用 `<script setup>`
- 所有样式使用**纯 CSS**（不要 SCSS 变量），内联颜色值
- Pinia 在 main.js 中安装后，页面中通过 `useXxxStore()` 调用
