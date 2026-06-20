'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllHistoryRecords } from '@/lib/history'

export default function WoPage() {
  const [historyCount, setHistoryCount] = useState(0)
  const [profileCount, setProfileCount] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHistoryCount(getAllHistoryRecords().length)
      const profiles = localStorage.getItem('bazi_profiles')
      setProfileCount(profiles ? JSON.parse(profiles).length : 0)
    }
  }, [])

  const MENU_ITEMS = [
    { icon: '📋', label: '查询历史', href: '/history', badge: historyCount },
    { icon: '🔮', label: '八字记录', href: '/ming/bazi', badge: profileCount },
    { icon: '⚙️', label: '设置', href: '/settings' },
  ]

  return (
    <div className="px-4 pt-4 pb-24 animate-fade-in">
      <h1 className="text-gold-gradient text-xl font-bold mb-6">我</h1>

      {/* 用户信息卡片 */}
      <div className="moonly-card p-5 text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-moonly-gold/30 to-moonly-purple/20 border-2 border-moonly-gold/30 mx-auto mb-3 flex items-center justify-center text-3xl">
          👤
        </div>
        <div className="text-white font-semibold">LifeGPS 用户</div>
        <div className="text-moonly-text-muted text-xs mt-1">探索命理，认识自己</div>
      </div>

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
              <span className="text-xs bg-moonly-gold/20 text-moonly-gold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            ) : null}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moonly-text-muted">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        ))}
      </div>

      {/* 关于 */}
      <div className="mt-6 text-center">
        <div className="text-moonly-text-muted text-xs">LifeGPS · 人生导航</div>
        <div className="text-moonly-text-muted text-[10px] mt-1">融合现代AI与传统命理智慧</div>
      </div>
    </div>
  )
}
