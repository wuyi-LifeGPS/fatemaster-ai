'use client'

import { useMemo } from 'react'
import { showToast } from '@/components/Toast'
import { hapticMedium } from '@/lib/haptic'

const DAILY_MOODS = [
  { mood: '阳光灿烂', emoji: '☀️' },
  { mood: '微风轻拂', emoji: '🍃' },
  { mood: '细雨绵绵', emoji: '🌧️' },
  { mood: '星光璀璨', emoji: '✨' },
]

const FORTUNES = [
  { score: 85, desc: '运势向好' },
  { score: 70, desc: '运势平稳' },
  { score: 55, desc: '谨慎行事' },
  { score: 90, desc: '抓住机遇' },
]

function getDayIndex(): number {
  return Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
}

export default function ShareCard() {
  const dayIndex = useMemo(() => getDayIndex(), [])
  const mood = DAILY_MOODS[dayIndex % DAILY_MOODS.length]
  const fortune = FORTUNES[dayIndex % FORTUNES.length]

  const handleShare = () => {
    hapticMedium()
    const text = `📅 ${new Date().toLocaleDateString('zh-CN')} 运势\n\n` +
      `🌟 今日运势：${fortune.score}分 - ${fortune.desc}\n` +
      `☀️ 今日心情：${mood.emoji} ${mood.mood}\n\n` +
      `来自 LifeGPS·人生导航`

    navigator.clipboard.writeText(text).then(() => {
      showToast('运势已复制到剪贴板', 'success')
    }).catch(() => {
      showToast('复制失败', 'error')
    })
  }

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📤</span>
          <h3 className="text-gold text-sm font-semibold">分享今日运势</h3>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4 mb-3">
        <p className="text-xs text-moonly-muted mb-2">{new Date().toLocaleDateString('zh-CN')}</p>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <span className="text-2xl">{mood.emoji}</span>
            <p className="text-[10px] text-white/60 mt-1">{mood.mood}</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: fortune.score >= 80 ? '#4ade80' : fortune.score >= 60 ? '#fbbf24' : '#f87171' }}>
              {fortune.score}
            </p>
            <p className="text-[10px] text-white/60">{fortune.desc}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleShare}
        className="w-full py-2.5 rounded-xl bg-gold/20 text-gold text-sm font-medium hover:bg-gold/30 transition-colors"
      >
        复制运势文案
      </button>
    </div>
  )
}
