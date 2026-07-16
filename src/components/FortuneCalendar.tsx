'use client'

import { useMemo } from 'react'

const FORTUNE_SCORES = [85, 70, 55, 90, 60, 75, 80, 65, 88, 72, 68, 78, 82, 62, 86, 74, 92, 84, 76, 66, 71, 87, 73, 89, 95, 81, 77, 63, 79, 83, 70]

function getScoreColor(score: number): string {
  if (score >= 80) return '#4ade80'
  if (score >= 60) return '#fbbf24'
  return '#f87171'
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'rgba(74, 222, 128, 0.15)'
  if (score >= 60) return 'rgba(251, 191, 36, 0.15)'
  return 'rgba(248, 113, 113, 0.15)'
}

export default function FortuneCalendar() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

  const days = useMemo(() => {
    const result = []
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDayOfWeek; i++) {
      result.push(null)
    }
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      result.push(i)
    }
    return result
  }, [firstDayOfWeek, daysInMonth])

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <h3 className="text-gold text-sm font-semibold">运势日历</h3>
        </div>
        <span className="text-xs text-moonly-muted">{year}年 {monthNames[month]}</span>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] text-moonly-muted py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const score = FORTUNE_SCORES[(day - 1) % FORTUNE_SCORES.length]
          const isToday = day === today.getDate()

          return (
            <div
              key={day}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 ${
                isToday ? 'ring-1 ring-gold' : ''
              }`}
              style={{ background: getScoreBg(score) }}
            >
              <span className={`text-[10px] ${isToday ? 'text-gold font-bold' : 'text-white/60'}`}>
                {day}
              </span>
              <span className="text-[8px] font-medium" style={{ color: getScoreColor(score) }}>
                {score}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#4ade80]" />
          <span className="text-[10px] text-moonly-muted">大吉</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#fbbf24]" />
          <span className="text-[10px] text-moonly-muted">平吉</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#f87171]" />
          <span className="text-[10px] text-moonly-muted">需谨慎</span>
        </div>
      </div>
    </div>
  )
}
