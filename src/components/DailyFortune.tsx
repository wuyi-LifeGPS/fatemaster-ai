'use client'

import { useMemo } from 'react'

const DAILY_FORTUNES = [
  { aspect: '整体', emoji: '🌟', score: 85, desc: '今日运势整体向好，适合主动出击。' },
  { aspect: '整体', emoji: '⭐', score: 70, desc: '今日运势平稳，按部就班即可。' },
  { aspect: '整体', emoji: '💫', score: 55, desc: '今日运势一般，需谨慎行事。' },
  { aspect: '整体', emoji: '✨', score: 90, desc: '今日运势极佳，抓住机遇。' },
  { aspect: '整体', emoji: '🌙', score: 60, desc: '今日运势平淡，保持平常心。' },
  { aspect: '整体', emoji: '☀️', score: 75, desc: '今日运势不错，适合社交。' },
  { aspect: '整体', emoji: '🌈', score: 80, desc: '今日运势上扬，好运连连。' },
  { aspect: '整体', emoji: '🔥', score: 65, desc: '今日运势中等，需耐心应对。' },
  { aspect: '整体', emoji: '💎', score: 88, desc: '今日运势旺盛，收获满满。' },
  { aspect: '整体', emoji: '🍀', score: 72, desc: '今日运势良好，诸事顺遂。' },
  { aspect: '整体', emoji: '🌸', score: 68, desc: '今日运势温和，适合休闲。' },
  { aspect: '整体', emoji: '⚡', score: 78, desc: '今日运势活跃，充满能量。' },
  { aspect: '整体', emoji: '🌊', score: 82, desc: '今日运势流畅，顺势而为。' },
  { aspect: '整体', emoji: '⛰️', score: 62, desc: '今日运势稳重，踏实前行。' },
  { aspect: '整体', emoji: '🦋', score: 86, desc: '今日运势灵动，创意迸发。' },
  { aspect: '整体', emoji: '🌺', score: 74, desc: '今日运势花开，人缘旺盛。' },
  { aspect: '整体', emoji: '🎯', score: 92, desc: '今日运势精准，目标达成。' },
  { aspect: '整体', emoji: '🚀', score: 84, desc: '今日运势高涨，勇往直前。' },
  { aspect: '整体', emoji: '🎨', score: 76, desc: '今日运势多彩，发挥创意。' },
  { aspect: '整体', emoji: '🎵', score: 66, desc: '今日运势和谐，享受生活。' },
  { aspect: '整体', emoji: '📚', score: 71, desc: '今日运势充实，适合学习。' },
  { aspect: '整体', emoji: '💡', score: 87, desc: '今日运势明亮，灵感涌现。' },
  { aspect: '整体', emoji: '🌿', score: 73, desc: '今日运势清新，焕然一新。' },
  { aspect: '整体', emoji: '🦅', score: 89, desc: '今日运势高飞，视野开阔。' },
  { aspect: '整体', emoji: '🐉', score: 95, desc: '今日运势龙腾，大吉大利。' },
  { aspect: '整体', emoji: '🦁', score: 81, desc: '今日运势威猛，气场强大。' },
  { aspect: '整体', emoji: '🦚', score: 77, desc: '今日运势华丽，魅力四射。' },
  { aspect: '整体', emoji: '🐢', score: 63, desc: '今日运势稳健，厚积薄发。' },
  { aspect: '整体', emoji: '🦋', score: 79, desc: '今日运势蜕变，焕然一新。' },
  { aspect: '整体', emoji: '🌻', score: 83, desc: '今日运势阳光，积极向上。' },
]

function getDailyFortune(): typeof DAILY_FORTUNES[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_FORTUNES[dayOfYear % DAILY_FORTUNES.length]
}

export default function DailyFortune() {
  const fortune = useMemo(() => getDailyFortune(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{fortune.emoji}</span>
          <h3 className="text-gold text-sm font-semibold">今日运势</h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold" style={{ color: fortune.score >= 80 ? '#4ade80' : fortune.score >= 60 ? '#fbbf24' : '#f87171' }}>
            {fortune.score}
          </span>
          <span className="text-xs text-moonly-muted">/100</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${fortune.score}%`,
              backgroundColor: fortune.score >= 80 ? '#4ade80' : fortune.score >= 60 ? '#fbbf24' : '#f87171',
            }}
          />
        </div>
      </div>

      <p className="text-white/80 text-sm leading-relaxed">{fortune.desc}</p>
    </div>
  )
}
