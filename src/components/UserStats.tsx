'use client'

import { useMemo } from 'react'

interface StatsData {
  profiles: number
  analyses: number
  checkins: number
  favorites: number
  streak: number
}

function loadStats(): StatsData {
  if (typeof window === 'undefined') {
    return { profiles: 0, analyses: 0, checkins: 0, favorites: 0, streak: 0 }
  }

  const profiles = JSON.parse(localStorage.getItem('lifegps_profiles') || '[]')
  const history = JSON.parse(localStorage.getItem('lifegps-history') || '[]')
  const checkins = JSON.parse(localStorage.getItem('lifegps_checkins') || '{}')
  const favorites = JSON.parse(localStorage.getItem('lifegps_favorites') || '[]')

  // Calculate streak
  let streak = 0
  const today = new Date().toISOString().split('T')[0]
  const d = new Date(today)
  if (checkins[today]) streak = 1
  while (true) {
    d.setDate(d.getDate() - 1)
    const ds = d.toISOString().split('T')[0]
    if (checkins[ds]) streak++
    else break
  }

  return {
    profiles: profiles.length,
    analyses: history.length,
    checkins: Object.keys(checkins).length,
    favorites: favorites.length,
    streak,
  }
}

export default function UserStats() {
  const stats = useMemo(() => loadStats(), [])

  const items = [
    { label: '八字档案', value: stats.profiles, icon: '📋', color: '#c9a96e' },
    { label: '分析次数', value: stats.analyses, icon: '🔮', color: '#8b5cf6' },
    { label: '打卡天数', value: stats.checkins, icon: '📅', color: '#10b981' },
    { label: '收藏内容', value: stats.favorites, icon: '⭐', color: '#f59e0b' },
  ]

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📊</span>
        <h3 className="text-gold text-sm font-semibold">我的数据</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map(item => (
          <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
            <span className="text-2xl">{item.icon}</span>
            <p className="text-xl font-bold mt-1" style={{ color: item.color }}>
              {item.value}
            </p>
            <p className="text-[10px] text-moonly-muted">{item.label}</p>
          </div>
        ))}
      </div>

      {stats.streak > 0 && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gold/80">
            🔥 连续打卡 {stats.streak} 天
          </span>
        </div>
      )}
    </div>
  )
}
