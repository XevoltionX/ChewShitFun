<script>
import { getRecords, saveRecords } from '@/utils/storage.js'

export default {
  onLaunch() {
    console.log('🚽 ChewShitFun 启动')

    const records = getRecords()
    if (records.length === 0) {
      const now = Date.now()
      const sampleRecords = [
        {
          id: 's1',
          timestamp: now - 86400000 * 2,
          consistency: '浅棕',
          smell: '适中',
          amount: '正常量',
          color: '浅棕'
        },
        {
          id: 's2',
          timestamp: now - 86400000 * 2,
          consistency: '深棕',
          smell: '有点臭',
          amount: '量很大',
          color: '深棕'
        },
        {
          id: 's3',
          timestamp: now - 86400000,
          consistency: '浅棕',
          smell: '没啥味',
          amount: '正常量',
          color: '浅棕'
        },
        {
          id: 's4',
          timestamp: now,
          consistency: '黄绿',
          smell: '有点臭',
          amount: '一点点',
          color: '黄绿'
        },
        {
          id: 's5',
          timestamp: now,
          consistency: '偏黑',
          smell: '生化武器',
          amount: '正常量',
          color: '偏黑'
        },
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
  -webkit-font-smoothing: antialiased;
}
</style>
