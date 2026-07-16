'use client'

import { useMemo } from 'react'

const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const FORTUNE_ICONS = {
  '大吉': '⭐⭐⭐',
  '吉': '⭐⭐',
  '平': '⭐',
  '凶': '⚠️',
  '大凶': '❌',
}

const FORTUNE_COLORS = {
  '大吉': 'text-green-400',
  '吉': 'text-green-300',
  '平': 'text-yellow-400',
  '凶': 'text-orange-400',
  '大凶': 'text-red-400',
}

function getWeekFortune(date: Date): { day: string; date: string; fortune: string }[] {
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay())

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)
    const hash = (dayOfYear * 13) % 100

    let fortune: string
    if (hash < 10) fortune = '大吉'
    else if (hash < 35) fortune = '吉'
    else if (hash < 70) fortune = '平'
    else if (hash < 90) fortune = '凶'
    else fortune = '大凶'

    return {
      day: WEEK_DAYS[i],
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      fortune,
    }
  })
}

export default function WeeklyFortune() {
  const weekFortune = useMemo(() => getWeekFortune(new Date()), [])
  const today = new Date().getDay()

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📊</span>
        <h3 className="text-gold text-sm font-semibold">本周运势</h3>
      </div>
      <div className="space-y-2">
        {weekFortune.map((item, i) => (
          <div
            key={item.day}
            className={`flex items-center justify-between p-2 rounded-lg ${
              i === today ? 'bg-gold/5 border border-gold/10' : 'bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs ${i === today ? 'text-gold font-medium' : 'text-moonly-muted'}`}>
                {item.day}
              </span>
              <span className="text-[10px] text-moonly-muted">{item.date}</span>
              {i === today && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold/10 text-gold">今日</span>
              )}
            </div>
            <div className={`text-xs ${FORTUNE_COLORS[item.fortune as keyof typeof FORTUNE_COLORS]}`}>
              {FORTUNE_ICONS[item.fortune as keyof typeof FORTUNE_ICONS]} {item.fortune}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
