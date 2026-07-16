'use client'

import { useState, useCallback } from 'react'
import { hapticMedium } from '@/lib/haptic'
import { showToast } from '@/components/Toast'

interface CheckInDay {
  date: string
  checked: boolean
  streak: number
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function getLast7Days(): string[] {
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

function getDayLabel(dateStr: string): string {
  const days = ['日', '一', '二', '三', '四', '五', '六']
  const d = new Date(dateStr)
  return days[d.getDay()]
}

function loadCheckIns(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem('lifegps_checkins') || '{}')
  } catch {
    return {}
  }
}

function saveCheckIns(data: Record<string, boolean>) {
  localStorage.setItem('lifegps_checkins', JSON.stringify(data))
}

function calcStreak(checkins: Record<string, boolean>): number {
  let streak = 0
  const today = getToday()
  const d = new Date(today)
  
  // Check today first
  if (checkins[today]) {
    streak = 1
  }
  
  // Check previous days
  while (true) {
    d.setDate(d.getDate() - 1)
    const dateStr = d.toISOString().split('T')[0]
    if (checkins[dateStr]) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

export default function DailyCheckIn() {
  const [checkins, setCheckins] = useState<Record<string, boolean>>(loadCheckIns)
  const today = getToday()
  const streak = calcStreak(checkins)
  const last7Days = getLast7Days()

  const handleCheckIn = useCallback(() => {
    if (checkins[today]) {
      showToast('今天已经打卡啦', 'info')
      return
    }

    hapticMedium()
    const next = { ...checkins, [today]: true }
    setCheckins(next)
    saveCheckIns(next)
    showToast(`打卡成功！连续${streak + 1}天`, 'success')
  }, [checkins, today, streak])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <h3 className="text-gold text-sm font-semibold">每日打卡</h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-fire">🔥</span>
          <span className="text-gold font-bold">{streak}</span>
          <span className="text-xs text-moonly-muted">天</span>
        </div>
      </div>

      {/* 7-day calendar */}
      <div className="flex items-center justify-between mb-4">
        {last7Days.map(date => {
          const isToday = date === today
          const checked = checkins[date]
          const dayNum = new Date(date).getDate()

          return (
            <div key={date} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-moonly-muted">{getDayLabel(date)}</span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  checked
                    ? 'bg-gold/20 text-gold'
                    : isToday
                    ? 'bg-white/10 text-white ring-1 ring-gold/50'
                    : 'bg-white/5 text-white/40'
                }`}
              >
                {checked ? '✓' : dayNum}
              </div>
            </div>
          )
        })}
      </div>

      {/* Check-in button */}
      <button
        onClick={handleCheckIn}
        disabled={checkins[today]}
        className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
          checkins[today]
            ? 'bg-green-500/10 text-green-400 cursor-default'
            : 'bg-gold/20 text-gold hover:bg-gold/30'
        }`}
      >
        {checkins[today] ? '✓ 今日已打卡' : '立即打卡'}
      </button>

      {streak >= 3 && (
        <p className="text-center text-[10px] text-gold/60 mt-2">
          🎉 已连续打卡 {streak} 天，保持好状态！
        </p>
      )}
    </div>
  )
}
