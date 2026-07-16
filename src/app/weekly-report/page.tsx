'use client'

import { useMemo } from 'react'
import Link from 'next/link'

interface DayFortune {
  day: string
  label: string
  score: number
  aspect: string
  advice: string
}

const WEEK_DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const ASPECTS = ['事业', '财运', '感情', '健康', '人际']

function getWeekData(): DayFortune[] {
  const today = new Date()
  const dayOfWeek = today.getDay() || 7 // 1-7
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayOfWeek + 1)

  return WEEK_DAYS.map((label, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
    const score = 50 + (seed * 13 + i * 7) % 50
    const aspect = ASPECTS[(seed + i) % ASPECTS.length]
    const advices = [
      '把握机会，主动出击',
      '稳扎稳打，不宜冒进',
      '保持耐心，等待时机',
      '多与他人沟通协作',
      '注意身体健康，适当休息',
      '财运不错，可考虑小额投资',
      '感情运势上升，适合表白',
    ]
    return {
      day: dateStr,
      label,
      score,
      aspect,
      advice: advices[(seed + i) % advices.length],
    }
  })
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#4ade80'
  if (score >= 60) return '#fbbf24'
  return '#f87171'
}

export default function WeeklyReportPage() {
  const weekData = useMemo(() => getWeekData(), [])
  const avgScore = Math.round(weekData.reduce((s, d) => s + d.score, 0) / weekData.length)

  const bestDay = weekData.reduce((best, d) => d.score > best.score ? d : best, weekData[0])
  const worstDay = weekData.reduce((worst, d) => d.score < worst.score ? d : worst, weekData[0])

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/ming" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-gold-gradient text-xl font-bold">运势周报</h1>
      </div>

      {/* Summary card */}
      <div className="moonly-card p-5 mb-4 text-center">
        <p className="text-moonly-muted text-xs mb-2">本周综合运势</p>
        <div className="w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl font-bold" style={{ background: `${getScoreColor(avgScore)}20`, color: getScoreColor(avgScore) }}>
          {avgScore}
        </div>
        <p className="text-white/80 text-sm">
          {avgScore >= 80 ? '本周运势大好，把握机会！' : avgScore >= 60 ? '本周运势平稳，稳扎稳打。' : '本周需谨慎行事，静待时机。'}
        </p>
      </div>

      {/* Best/Worst day */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="moonly-card p-3">
          <p className="text-[10px] text-green-400 mb-1">🌟 最佳运势</p>
          <p className="text-white font-medium">{bestDay.label}</p>
          <p className="text-xs text-white/60">{bestDay.day} · {bestDay.score}分</p>
        </div>
        <div className="moonly-card p-3">
          <p className="text-[10px] text-red-400 mb-1">⚠️ 需谨慎</p>
          <p className="text-white font-medium">{worstDay.label}</p>
          <p className="text-xs text-white/60">{worstDay.day} · {worstDay.score}分</p>
        </div>
      </div>

      {/* Day by day */}
      <div className="space-y-3">
        {weekData.map((day, i) => (
          <div key={i} className="moonly-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80 font-medium">{day.label}</span>
                <span className="text-xs text-moonly-muted">{day.day}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: getScoreColor(day.score) }}>
                {day.score}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full"
                style={{ width: `${day.score}%`, backgroundColor: getScoreColor(day.score) }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-moonly-muted">
                {day.aspect}
              </span>
              <span className="text-[10px] text-white/50">{day.advice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
