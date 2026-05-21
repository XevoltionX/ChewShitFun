# 💩 ChewShitFun

> 神人做的记录每天拉屎情况并给予健康建议的神人APP

## 📱 简介

ChewShitFun 是一款"严肃"的肠道健康追踪应用。通过长按马桶、拖拽气泡选择维度的创新交互，轻松记录每一次"安放C4任务"。内置 ShitMan 拉屎侠智能分析引擎，根据历史数据给出个性化饮食建议。

## ✨ 功能

- 🔐 **假装登录** — 预设用户名，自己人才能进
- 📅 **屎诗日历** — 农历+十二时辰+四季，点击看详情
- 💩 **气泡划选记录** — 长按马桶，拖拽4层气泡选粘稠度/臭味/量/颜色
- 🦸 **ShitMan 拉屎侠** — 7天数据分析，5维度健康建议
- 📜 **岁月屎书** — 待办清单，打勾删除
- 🏆 **成就徽章** — 5种成就，解锁条件各异
- 🌙 **日/夜间模式** — 一键切换，护眼拉屎
- 📳 **振动+音效** — 每步操作都有反馈

## 🛠 技术栈

- **框架**: uni-app (Vue 3 + Composition API)
- **状态管理**: Pinia
- **农历**: solarlunar
- **平台**: Android / iOS / H5

## 🚀 运行

```bash
npm install
# 用 HBuilderX 打开项目，运行到浏览器或打包 APK
```

## 📦 打包

HBuilderX → 发行 → 原生App-云打包 → Android（使用公共测试证书）

## 🎮 操作指南

| 操作 | 方式 |
|------|------|
| 记录拉屎 | 底部中间💩大按钮 → 长按马桶 → 拖拽选4层气泡 → 松手 |
| 取消记录 | 拖到顶部或底部❌取消区松手 |
| 查看详情 | 日历页点击日期格子 |
| 切换月份 | 日历页点 ‹ › 箭头 |
| 翻牌 | 底部 Tab 切战绩/记录/用户 |

## 📁 项目结构

```
├── pages/
│   ├── login/       # 登录页
│   ├── calendar/    # 日历首页（今日战况+ShitMan）
│   ├── record/      # 记录页（气泡划选+岁月屎书）
│   └── user/        # 用户页（战报+成就+主题切换）
├── components/
│   ├── calendar-grid.vue      # 日历网格
│   ├── day-card-popup.vue     # 日期详情弹窗
│   ├── custom-tabbar.vue      # 自定义底部导航
│   └── toast-notification.vue # 消息通知
├── stores/poop.js   # Pinia 数据仓库
├── utils/
│   ├── storage.js   # 本地存储
│   ├── toast.js     # 全局 Toast
│   ├── sound.js     # 音效
│   └── theme.js     # 日/夜间模式
└── static/          # 图标+音效
```

## 👥 预设用户

余苟千 / 朋友A / 朋友B / 朋友C

改名单：`utils/storage.js` → `DEFAULT_USER_CONFIG.presetNames`

---

> *"你不记录美好拉屎生活，拉屎侠也对你的拉屎生涯爱莫能助！"* —— ShitMan
