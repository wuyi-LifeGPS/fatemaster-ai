'use client'

import { useMemo } from 'react'

interface Activity {
  id: string
  type: 'profile' | 'analysis' | 'checkin' | 'favorite' | 'chat'
  title: string
  time: string
  icon: string
}

function loadActivities(): Activity[] {
  if (typeof window === 'undefined') return []

  const activities: Activity[] = []

  // Profiles
  const profiles = JSON.parse(localStorage.getItem('lifegps_profiles') || '[]')
  profiles.slice(-3).forEach((p: any) => {
    activities.push({
      id: `profile-${p.id}`,
      type: 'profile',
      title: `添加了八字档案：${p.name}`,
      time: p.createdAt || new Date().toISOString(),
      icon: '📋',
    })
  })

  // History
  const history = JSON.parse(localStorage.getItem('lifegps-history') || '[]')
  history.slice(-3).forEach((h: any) => {
    activities.push({
      id: `history-${h.id}`,
      type: 'analysis',
      title: `进行了${h.type === 'bazi' ? '八字' : h.type === 'match' ? '合婚' : h.type === 'career' ? '事业' : '命理'}分析`,
      time: h.timestamp,
      icon: '🔮',
    })
  })

  // Checkins
  const checkins = JSON.parse(localStorage.getItem('lifegps_checkins') || '{}')
  Object.keys(checkins).slice(-3).forEach(date => {
    activities.push({
      id: `checkin-${date}`,
      type: 'checkin',
      title: '完成每日打卡',
      time: date,
      icon: '📅',
    })
  })

  // Favorites
  const favorites = JSON.parse(localStorage.getItem('lifegps_favorites') || '[]')
  favorites.slice(-2).forEach((f: any) => {
    activities.push({
      id: `fav-${f.id}`,
      type: 'favorite',
      title: `收藏了${f.name || '内容'}`,
      time: f.addedAt || new Date().toISOString(),
      icon: '⭐',
    })
  })

  // Sort by time desc
  return activities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10)
}

function formatTime(time: string): string {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

export default function ActivityFeed() {
  const activities = useMemo(() => loadActivities(), [])

  if (activities.length === 0) {
    return (
      <div className="moonly-card p-4 animate-fade-in">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📋</span>
          <h3 className="text-gold text-sm font-semibold">最近动态</h3>
        </div>
        <div className="text-center py-4">
          <span className="text-2xl">🌱</span>
          <p className="text-white/40 text-xs mt-2">还没有活动记录</p>
          <p className="text-white/30 text-[10px] mt-1">去八字分析或每日打卡开始记录吧</p>
        </div>
      </div>
    )
  }

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📋</span>
        <h3 className="text-gold text-sm font-semibold">最近动态</h3>
      </div>

      <div className="space-y-2">
        {activities.map((activity, i) => (
          <div key={activity.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
            <span className="text-lg">{activity.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80 truncate">{activity.title}</p>
              <p className="text-[10px] text-moonly-muted">{formatTime(activity.time)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
