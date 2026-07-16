'use client'

import { useState, useEffect } from 'react'

interface UsageStats {
  visitCount: number
  firstVisit: number
  lastVisit: number
  analysisCount: number
  chatCount: number
  streakDays: number
}

const STORAGE_KEY = 'lifegps_usage_stats'

function getStats(): UsageStats {
  if (typeof window === 'undefined') {
    return { visitCount: 0, firstVisit: Date.now(), lastVisit: Date.now(), analysisCount: 0, chatCount: 0, streakDays: 1 }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return { visitCount: 0, firstVisit: Date.now(), lastVisit: Date.now(), analysisCount: 0, chatCount: 0, streakDays: 1 }
}

function saveStats(stats: UsageStats) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function trackVisit() {
  const stats = getStats()
  const now = Date.now()
  const lastDate = new Date(stats.lastVisit).toDateString()
  const today = new Date(now).toDateString()

  stats.visitCount++
  stats.lastVisit = now

  if (today !== lastDate) {
    const yesterday = new Date(now - 24 * 60 * 60 * 1000).toDateString()
    if (lastDate === yesterday) {
      stats.streakDays++
    } else {
      stats.streakDays = 1
    }
  }

  saveStats(stats)
}

export function trackAnalysis() {
  const stats = getStats()
  stats.analysisCount++
  saveStats(stats)
}

export function trackChat() {
  const stats = getStats()
  stats.chatCount++
  saveStats(stats)
}

export default function UsageStatsPanel() {
  const [stats, setStats] = useState<UsageStats | null>(null)

  useEffect(() => {
    setStats(getStats())
  }, [])

  if (!stats) return null

  const daysSinceFirst = Math.floor((Date.now() - stats.firstVisit) / (1000 * 60 * 60 * 24)) + 1

  return (
    <div className="moonly-card p-4">
      <h3 className="text-gold text-sm font-semibold mb-3">使用统计</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 rounded-xl bg-white/5">
          <div className="text-2xl font-bold text-white">{stats.visitCount}</div>
          <div className="text-xs text-moonly-muted mt-1">总访问次数</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/5">
          <div className="text-2xl font-bold text-gold">{stats.streakDays}</div>
          <div className="text-xs text-moonly-muted mt-1">连续访问天数</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/5">
          <div className="text-2xl font-bold text-white">{stats.analysisCount}</div>
          <div className="text-xs text-moonly-muted mt-1">命理分析次数</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/5">
          <div className="text-2xl font-bold text-white">{stats.chatCount}</div>
          <div className="text-xs text-moonly-muted mt-1">AI对话次数</div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span className="text-xs text-moonly-muted">
          已使用 {daysSinceFirst} 天 · 首次访问 {new Date(stats.firstVisit).toLocaleDateString('zh-CN')}
        </span>
      </div>
    </div>
  )
}
