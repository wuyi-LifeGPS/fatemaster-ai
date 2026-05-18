// ===== 查询历史记录管理 =====
// 统一使用 localStorage 存储各模块查询记录

const STORAGE_KEY = 'lifegps_query_history'
const MAX_RECORDS = 50  // 每个模块最多保留条数

export type QueryType = 'bazi' | 'match' | 'career' | 'daily'

export interface HistoryRecord {
  id: string
  type: QueryType
  title: string
  timestamp: number
  dateStr: string        // 查询日期 2026-05-18
  formData: any          // 表单数据，用于重新查询
  resultSummary: string  // 结果摘要
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function getAllHistory(): HistoryRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAllHistory(list: HistoryRecord[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

/**
 * 添加一条查询记录
 */
export function addHistory(
  type: QueryType,
  title: string,
  formData: any,
  resultSummary: string
): HistoryRecord {
  const list = getAllHistory()
  const record: HistoryRecord = {
    id: generateId(),
    type,
    title,
    timestamp: Date.now(),
    dateStr: new Date().toLocaleDateString('zh-CN'),
    formData,
    resultSummary,
  }

  // 同类型去重：如果最新一条跟这条 formData 一样，先删掉旧的
  const sameType = list.filter(r => r.type === type)
  const sameForm = sameType.find(r => JSON.stringify(r.formData) === JSON.stringify(formData))
  if (sameForm) {
    const idx = list.findIndex(r => r.id === sameForm.id)
    if (idx >= 0) list.splice(idx, 1)
  }

  list.unshift(record)

  // 限制总条数
  const trimmed = list.slice(0, MAX_RECORDS * 4)  // 所有类型合计最多 200 条
  saveAllHistory(trimmed)
  return record
}

/**
 * 获取某类型的历史记录
 */
export function getHistoryByType(type: QueryType): HistoryRecord[] {
  return getAllHistory().filter(r => r.type === type)
}

/**
 * 获取全部历史记录（按时间倒序）
 */
export function getAllHistoryRecords(): HistoryRecord[] {
  return getAllHistory()
}

/**
 * 删除单条记录
 */
export function removeHistory(id: string) {
  const list = getAllHistory().filter(r => r.id !== id)
  saveAllHistory(list)
}

/**
 * 清空某类型记录
 */
export function clearHistoryByType(type: QueryType) {
  const list = getAllHistory().filter(r => r.type !== type)
  saveAllHistory(list)
}

/**
 * 清空全部记录
 */
export function clearAllHistory() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * 格式化时间显示
 */
export function formatHistoryTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`
  if (diff < 3 * day) return `${Math.floor(diff / day)} 天前`
  return new Date(timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

/**
 * 获取类型中文名
 */
export function getTypeLabel(type: QueryType): string {
  const map: Record<QueryType, string> = {
    bazi: '八字分析',
    match: '合婚分析',
    career: '事业合作',
    daily: '每日运势',
  }
  return map[type]
}

/**
 * 获取类型颜色
 */
export function getTypeColor(type: QueryType): string {
  const map: Record<QueryType, string> = {
    bazi: 'bg-amber-100 text-amber-700',
    match: 'bg-pink-100 text-pink-700',
    career: 'bg-green-100 text-green-700',
    daily: 'bg-blue-100 text-blue-700',
  }
  return map[type]
}
