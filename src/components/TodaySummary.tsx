'use client'

import { useMemo } from 'react'

const MOODS = [
  { text: '阳光灿烂', emoji: '☀️', color: '#fbbf24' },
  { text: '微风轻拂', emoji: '🍃', color: '#4ade80' },
  { text: '细雨绵绵', emoji: '🌧️', color: '#60a5fa' },
  { text: '星光璀璨', emoji: '✨', color: '#a78bfa' },
  { text: '月光如水', emoji: '🌙', color: '#818cf8' },
  { text: '朝霞满天', emoji: '🌅', color: '#f87171' },
  { text: '云淡风轻', emoji: '☁️', color: '#94a3b8' },
  { text: '彩虹当空', emoji: '🌈', color: '#f472b6' },
]

const FORTUNES = [
  { score: 85, desc: '运势向好，主动出击' },
  { score: 70, desc: '运势平稳，按部就班' },
  { score: 55, desc: '运势一般，谨慎行事' },
  { score: 90, desc: '运势极佳，抓住机遇' },
  { score: 60, desc: '运势平淡，保持平常心' },
  { score: 75, desc: '运势不错，适合社交' },
  { score: 80, desc: '运势上扬，好运连连' },
  { score: 65, desc: '运势中等，需耐心应对' },
]

const ADVICE = [
  { emoji: '💼', title: '工作', text: '效率高涨' },
  { emoji: '💕', title: '感情', text: '适合表达' },
  { emoji: '💰', title: '财运', text: '平稳为宜' },
  { emoji: '🏃', title: '健康', text: '户外运动' },
  { emoji: '📚', title: '学习', text: '记忆力佳' },
  { emoji: '🤝', title: '人际', text: '人缘旺盛' },
  { emoji: '🎨', title: '创意', text: '灵感迸发' },
  { emoji: '🧘', title: '修身', text: '冥想静心' },
]

function getDayIndex(): number {
  return Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
}

export default function TodaySummary() {
  const dayIndex = useMemo(() => getDayIndex(), [])
  const mood = MOODS[dayIndex % MOODS.length]
  const fortune = FORTUNES[dayIndex % FORTUNES.length]
  const advice = ADVICE[dayIndex % ADVICE.length]

  const scoreColor = fortune.score >= 80 ? '#4ade80' : fortune.score >= 60 ? '#fbbf24' : '#f87171'

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📋</span>
        <h3 className="text-gold text-sm font-semibold">今日概览</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* 心情 */}
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div
            className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-xl"
            style={{ background: `${mood.color}20` }}
          >
            {mood.emoji}
          </div>
          <p className="text-[10px] text-moonly-muted mb-0.5">心情</p>
          <p className="text-xs text-white/80">{mood.text}</p>
        </div>

        {/* 运势 */}
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="relative w-10 h-10 mx-auto mb-2">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke={scoreColor}
                strokeWidth="3"
                strokeDasharray={`${(fortune.score / 100) * 100.5} 100.5`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: scoreColor }}>
              {fortune.score}
            </span>
          </div>
          <p className="text-[10px] text-moonly-muted mb-0.5">运势</p>
          <p className="text-xs text-white/80 truncate">{fortune.desc}</p>
        </div>

        {/* 建议 */}
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="w-10 h-10 rounded-full bg-gold/10 mx-auto mb-2 flex items-center justify-center text-xl">
            {advice.emoji}
          </div>
          <p className="text-[10px] text-moonly-muted mb-0.5">{advice.title}</p>
          <p className="text-xs text-white/80">{advice.text}</p>
        </div>
      </div>
    </div>
  )
}
