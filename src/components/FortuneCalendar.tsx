'use client'

import { useState, useMemo } from 'react'
import FortuneDetailModal from './FortuneDetailModal'

function getDaySeed(year: number, month: number, day: number): number {
  return year * 10000 + (month + 1) * 100 + day
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function getScoreForDay(year: number, month: number, day: number): number {
  const seed = getDaySeed(year, month, day)
  return Math.floor(seededRandom(seed) * 41) + 55 // 55-95
}

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

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

export default function FortuneCalendar() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [displayYear, setDisplayYear] = useState(() => new Date().getFullYear())
  const [displayMonth, setDisplayMonth] = useState(() => new Date().getMonth())

  const today = new Date()
  const isCurrentMonth = displayYear === today.getFullYear() && displayMonth === today.getMonth()

  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(displayYear, displayMonth, 1).getDay()

  const days = useMemo(() => {
    const result: (number | null)[] = []
    for (let i = 0; i < firstDayOfWeek; i++) {
      result.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      result.push(i)
    }
    return result
  }, [firstDayOfWeek, daysInMonth])

  const goPrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11)
      setDisplayYear(y => y - 1)
    } else {
      setDisplayMonth(m => m - 1)
    }
  }

  const goNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0)
      setDisplayYear(y => y + 1)
    } else {
      setDisplayMonth(m => m + 1)
    }
  }

  const goToday = () => {
    setDisplayYear(today.getFullYear())
    setDisplayMonth(today.getMonth())
  }

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <h3 className="text-gold text-sm font-semibold">运势日历</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrevMonth}
            className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="text-xs text-white/80 w-20 text-center">{displayYear}年 {monthNames[displayMonth]}</span>
          <button
            onClick={goNextMonth}
            className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          {!isCurrentMonth && (
            <button
              onClick={goToday}
              className="text-[10px] text-gold px-2 py-1 rounded bg-gold/10 hover:bg-gold/20 transition"
            >
              今
            </button>
          )}
        </div>
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

          const score = getScoreForDay(displayYear, displayMonth, day)
          const isToday = isCurrentMonth && day === today.getDate()

          return (
            <div
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:bg-white/5 transition-colors ${
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

      {/* Detail Modal */}
      {selectedDay !== null && (
        <FortuneDetailModal
          day={selectedDay}
          month={displayMonth}
          year={displayYear}
          score={getScoreForDay(displayYear, displayMonth, selectedDay)}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  )
}
