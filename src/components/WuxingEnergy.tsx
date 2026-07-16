'use client'

import { useMemo, memo } from 'react'

const WUXING_DATA = [
  { name: '木', color: '#4ade80', emoji: '🌲' },
  { name: '火', color: '#f87171', emoji: '🔥' },
  { name: '土', color: '#fbbf24', emoji: '🏔️' },
  { name: '金', color: '#e2e8f0', emoji: '⚜️' },
  { name: '水', color: '#60a5fa', emoji: '💧' },
]

function getDailyWuxingEnergy(date: Date): { name: string; value: number }[] {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return WUXING_DATA.map((wx, i) => {
    const hash = (dayOfYear * 17 + i * 31) % 100
    const value = 30 + (hash % 50) // 30-80 之间的值
    return { name: wx.name, value }
  })
}

function WuxingEnergy() {
  const energies = useMemo(() => getDailyWuxingEnergy(new Date()), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">⚡</span>
        <h3 className="text-gold text-sm font-semibold">今日五行能量</h3>
      </div>
      <div className="space-y-3">
        {WUXING_DATA.map((wx, i) => {
          const energy = energies[i]
          return (
            <div key={wx.name} className="flex items-center gap-3">
              <span className="text-sm w-6 text-center">{wx.emoji}</span>
              <span className="text-white text-xs w-6">{wx.name}</span>
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${energy.value}%`,
                    backgroundColor: wx.color,
                    opacity: 0.7,
                  }}
                />
              </div>
              <span className="text-moonly-muted text-xs w-8 text-right">{energy.value}%</span>
            </div>
          )
        })}
      </div>
      <p className="text-[10px] text-moonly-muted mt-3 text-center">
        💡 能量值高的事项今日更为有利
      </p>
    </div>
  )
}

export default memo(WuxingEnergy)
