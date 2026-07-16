'use client'

import { useMemo } from 'react'

interface FortuneDetailModalProps {
  day: number
  score: number
  onClose: () => void
}

const ASPECTS = [
  { name: '整体', score: 85, advice: '今日运势良好，适合主动出击。' },
  { name: '事业', score: 78, advice: '工作中可能遇到小挑战，保持耐心。' },
  { name: '财运', score: 72, advice: '理财需谨慎，不宜大额支出。' },
  { name: '感情', score: 88, advice: '桃花运旺盛，适合社交活动。' },
  { name: '健康', score: 80, advice: '身体状况良好，保持运动习惯。' },
]

const LUCKY_ITEMS = [
  { label: '幸运色', value: '金色', emoji: '🟡' },
  { label: '幸运数', value: '6', emoji: '6️⃣' },
  { label: '吉方', value: '东南', emoji: '🧭' },
  { label: '贵人', value: '属鼠', emoji: '🐭' },
]

function getScoreColor(score: number): string {
  if (score >= 80) return '#4ade80'
  if (score >= 60) return '#fbbf24'
  return '#f87171'
}

export default function FortuneDetailModal({ day, score, onClose }: FortuneDetailModalProps) {
  const aspects = useMemo(() => {
    // Use day as seed to make it deterministic
    const seed = day * 13 + 7
    return ASPECTS.map((a, i) => ({
      ...a,
      score: Math.min(100, Math.max(40, (seed + i * 17) % 60 + 40)),
    }))
  }, [day])

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a1428] rounded-t-3xl border-t border-white/10 animate-slide-up max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <span className="text-white font-medium">{day}日运势详情</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10">
            ✕
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Score highlight */}
          <div className="text-center py-4">
            <div className="w-20 h-20 rounded-full mx-auto mb-2 flex items-center justify-center text-3xl font-bold" style={{ background: `${getScoreColor(score)}20`, color: getScoreColor(score) }}>
              {score}
            </div>
            <p className="text-white/60 text-sm">
              {score >= 80 ? '运势大吉，把握机会' : score >= 60 ? '运势平稳，稳扎稳打' : '运势低迷，谨慎行事'}
            </p>
          </div>

          {/* Aspect bars */}
          <div className="space-y-3">
            {aspects.map(aspect => (
              <div key={aspect.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/70">{aspect.name}</span>
                  <span className="text-xs font-medium" style={{ color: getScoreColor(aspect.score) }}>
                    {aspect.score}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${aspect.score}%`, backgroundColor: getScoreColor(aspect.score) }}
                  />
                </div>
                <p className="text-[10px] text-white/40 mt-0.5">{aspect.advice}</p>
              </div>
            ))}
          </div>

          {/* Lucky items */}
          <div className="grid grid-cols-2 gap-2">
            {LUCKY_ITEMS.map(item => (
              <div key={item.label} className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                <span className="text-lg">{item.emoji}</span>
                <div>
                  <p className="text-[10px] text-moonly-muted">{item.label}</p>
                  <p className="text-sm text-white/80">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
  )
}
