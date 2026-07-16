'use client'

import { useMemo } from 'react'

const DIRECTIONS = [
  { name: '东', emoji: '➡️', angle: 90 },
  { name: '南', emoji: '⬇️', angle: 180 },
  { name: '西', emoji: '⬅️', angle: 270 },
  { name: '北', emoji: '⬆️', angle: 0 },
  { name: '东南', emoji: '↘️', angle: 135 },
  { name: '东北', emoji: '↗️', angle: 45 },
  { name: '西南', emoji: '↙️', angle: 225 },
  { name: '西北', emoji: '↖️', angle: 315 },
]

const AUSPICIOUS_TYPES = [
  { key: 'caishen', name: '财神', emoji: '💰', desc: '求财、投资' },
  { key: 'taohua', name: '桃花', emoji: '🌸', desc: '感情、人际' },
  { key: 'wenchang', name: '文昌', emoji: '📚', desc: '学业、考试' },
  { key: 'guiren', name: '贵人', emoji: '🤝', desc: '事业、合作' },
]

function getDailyDirections(date: Date): { type: string; direction: string; emoji: string }[] {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return AUSPICIOUS_TYPES.map((type, i) => {
    const dirIndex = (dayOfYear * 7 + i * 13) % DIRECTIONS.length
    return {
      type: type.name,
      direction: DIRECTIONS[dirIndex].name,
      emoji: type.emoji,
    }
  })
}

export default function DirectionGuide() {
  const directions = useMemo(() => getDailyDirections(new Date()), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🧭</span>
        <h3 className="text-gold text-sm font-semibold">今日吉方</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {directions.map((dir) => (
          <div key={dir.type} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5">
            <span className="text-lg">{dir.emoji}</span>
            <div>
              <div className="text-white text-xs font-medium">{dir.type}位</div>
              <div className="text-gold text-sm font-bold">{dir.direction}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
