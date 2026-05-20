const KEYS = {
  POOP_RECORDS: 'csf_poop_records',
  USER_CONFIG: 'csf_user_config',
  ACHIEVEMENTS: 'csf_achievements',
}

export const DEFAULT_USER_CONFIG = { lastUsername: '', presetNames: ['余苟千', '朋友A', '朋友B', '朋友C'] }

export function getRecords() {
  try {
    const data = uni.getStorageSync(KEYS.POOP_RECORDS)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('读取记录失败:', e)
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
    return data ? JSON.parse(data) : { ...DEFAULT_USER_CONFIG }
  } catch (e) {
    console.error('读取配置失败:', e)
    return { ...DEFAULT_USER_CONFIG }
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
    console.error('读取成就失败:', e)
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
