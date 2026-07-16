'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import UsageStatsPanel from '@/components/UsageStats'
import { getAllHistoryRecords } from '@/lib/history'
import { getTodayGanZhi, getShiShen, getWuXing } from '@/lib/bazi'
import { getProfiles } from '@/lib/bazi-profiles'
import AchievementSystem from '@/components/AchievementSystem'
import UserStats from '@/components/UserStats'
import ActivityFeed from '@/components/ActivityFeed'

const WUXING_COLOR: Record<string, string> = {
  '木': '#4ade80', '火': '#f87171', '土': '#fbbf24', '金': '#e2e8f0', '水': '#60a5fa',
}

const SHISHEN_EMOJI: Record<string, string> = {
  '正印': '👩‍🦰', '偏印': '🤓', '正官': '👨‍💼', '七杀': '⚔️',
  '正财': '💰', '偏财': '🎰', '比肩': '🤝', '劫财': '🏴‍☠️',
  '食神': '😋', '伤官': '😤',
}

export default function WoPage() {
  const [historyCount, setHistoryCount] = useState(0)
  const [profileCount, setProfileCount] = useState(0)
  const [meditationMinutes, setMeditationMinutes] = useState(0)
  const [booksRead, setBooksRead] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHistoryCount(getAllHistoryRecords().length)
      setProfileCount(getProfiles().length)
      const med = localStorage.getItem('meditation_total_minutes')
      setMeditationMinutes(med ? parseInt(med, 10) : 0)
      const progress = localStorage.getItem('book_reading_progress')
      if (progress) {
        const data = JSON.parse(progress)
        setBooksRead(Object.values(data).filter((v: any) => v >= 100).length)
      }
    }
  }, [])

  const today = getTodayGanZhi()
  const profiles = getProfiles()
  const firstProfile = profiles[0]

  const MENU_ITEMS = [
    { icon: '📋', label: '查询历史', href: '/history', badge: historyCount },
    { icon: '🔮', label: '八字记录', href: '/ming/records', badge: profileCount },
    { icon: '🎋', label: '每日签', href: '/wo/daily-fortune' },
    { icon: '✨', label: '开运指南', href: '/lucky-guide' },
    { icon: '👔', label: '五行穿衣', href: '/wo/dress-guide' },
    { icon: '⚖️', label: '八字对比', href: '/wo/compare' },
    { icon: '♈', label: '星座运势', href: '/wo/horoscope' },
    { icon: '⭐', label: '我的收藏', href: '/wo/favorites' },
    { icon: '☯️', label: '今日运势', href: '/ming?tab=liuri' },
    { icon: '⚙️', label: '设置', href: '/settings' },
    { icon: '🧰', label: '工具箱', href: '/toolbox' },
    { icon: '❓', label: '帮助', href: '/help' },
    { icon: 'ℹ️', label: '关于', href: '/about' },
  ]

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      <h1 className="text-gold-gradient text-xl font-bold mb-6">我</h1>

      {/* 用户信息卡片 */}
      <div className="moonly-card p-5 text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c9a96e]/30 to-[#6b5b95]/20 border-2 border-[#c9a96e]/30 mx-auto mb-3 flex items-center justify-center text-3xl">
          👤
        </div>
        <div className="text-white font-semibold">LifeGPS 用户</div>
        <div className="text-moonly-muted text-xs mt-1">探索命理，认识自己</div>
      </div>

      {/* 今日运势快捷卡片 */}
      {firstProfile && (
        <Link href="/ming?tab=liuri" className="block mb-6">
          <div className="moonly-card p-4 border border-[#c9a96e]/20 hover:bg-white/5 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gold text-sm font-semibold">今日运势</span>
              <span className="text-moonly-muted text-xs">{today.dateStr}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#c9a96e]/10 border border-[#c9a96e]/20 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-gold">{today.day.gan}</span>
                <span className="text-xs text-white/50">{today.day.zhi}</span>
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium mb-1">
                  {today.day.gan}{today.day.zhi}日
                </div>
                <div className="flex items-center gap-1.5">
                  {['事业', '财运', '人际'].map((label) => (
                    <span key={label} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-moonly-muted">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>
        </Link>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="moonly-card p-3 text-center">
          <div className="text-xl font-bold text-gold">{profileCount}</div>
          <div className="text-moonly-muted text-xs">八字档案</div>
        </div>
        <div className="moonly-card p-3 text-center">
          <div className="text-xl font-bold text-gold">{historyCount}</div>
          <div className="text-moonly-muted text-xs">查询记录</div>
        </div>
        <div className="moonly-card p-3 text-center">
          <div className="text-xl font-bold text-gold">{meditationMinutes}</div>
          <div className="text-moonly-muted text-xs">冥想分钟</div>
        </div>
        <div className="moonly-card p-3 text-center">
          <div className="text-xl font-bold text-gold">{booksRead}</div>
          <div className="text-moonly-muted text-xs">已读书籍</div>
        </div>
      </div>

      <UsageStatsPanel />
      <UserStats />
      <ActivityFeed />

      {/* 菜单 */}
      <div className="space-y-1">
        {MENU_ITEMS.map(item => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 moonly-card hover:bg-white/5 transition"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1 text-white text-sm">{item.label}</span>
            {item.badge ? (
              <span className="text-xs bg-[#c9a96e]/20 text-[#c9a96e] px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            ) : null}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moonly-muted">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        ))}
      </div>

      <AchievementSystem />

      {/* 关于 */}
      <div className="mt-8 text-center">
        <div className="text-moonly-muted text-xs">LifeGPS · 人生导航</div>
        <div className="text-moonly-muted text-[10px] mt-1">融合现代AI与传统命理智慧</div>
      </div>
    </div>
  )
}
