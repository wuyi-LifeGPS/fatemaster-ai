'use client'

import { hapticMedium } from '@/lib/haptic'
import { showToast } from '@/components/Toast'

interface ShareMingPanProps {
  profile?: {
    name: string
    gender: string
    year: number
    month: number
    day: number
    hour: number
    minute: number
    birthTimeLabel: string
  }
  baziData?: {
    pillars: { name: string; gan: string; zhi: string }[]
    dayMaster: string
    wuXingCount: Record<string, number>
  }
}

export default function ShareMingPan({ profile, baziData }: ShareMingPanProps) {
  if (!profile || !baziData) return null

  const handleShare = () => {
    hapticMedium()

    const pillars = baziData.pillars.map(p => `${p.name}：${p.gan}${p.zhi}`).join('\n')
    const wuxing = Object.entries(baziData.wuXingCount)
      .map(([k, v]) => `${k}：${v}`)
      .join(' | ')

    const text = `📋 八字命盘\n\n` +
      `👤 ${profile.name}（${profile.gender}）\n` +
      `🎂 ${profile.year}年${profile.month}月${profile.day}日 ${profile.birthTimeLabel}\n\n` +
      `${pillars}\n\n` +
      `☯️ 日主：${baziData.dayMaster}\n` +
      `🌊 五行：${wuxing}\n\n` +
      `来自 LifeGPS·人生导航`

    navigator.clipboard.writeText(text).then(() => {
      showToast('命盘信息已复制', 'success')
    }).catch(() => {
      showToast('复制失败', 'error')
    })
  }

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📤</span>
        <h3 className="text-gold text-sm font-semibold">分享命盘</h3>
      </div>

      <div className="bg-white/5 rounded-xl p-3 mb-3">
        <p className="text-xs text-white/70 mb-1">👤 {profile.name} · {profile.gender}</p>
        <p className="text-xs text-moonly-muted">{profile.year}年{profile.month}月{profile.day}日 {profile.birthTimeLabel}</p>
        <div className="flex gap-2 mt-2">
          {baziData.pillars.slice(0, 4).map(p => (
            <span key={p.name} className="text-xs text-gold/80 bg-gold/10 px-1.5 py-0.5 rounded">
              {p.gan}{p.zhi}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleShare}
        className="w-full py-2.5 rounded-xl bg-gold/20 text-gold text-sm font-medium hover:bg-gold/30 transition-colors"
      >
        复制命盘信息
      </button>
    </div>
  )
}
