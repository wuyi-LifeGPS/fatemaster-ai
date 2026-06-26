'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTodayGanZhi, getWuXing } from '@/lib/bazi'

const WUXING_COLORS: Record<string, { colors: string[]; desc: string; advice: string }> = {
  '木': {
    colors: ['#4ade80', '#22c55e', '#16a34a', '#15803d'],
    desc: '绿色系',
    advice: '今日木气旺盛，宜穿绿色、青色衣物，有助于提升活力与创造力。',
  },
  '火': {
    colors: ['#f87171', '#ef4444', '#dc2626', '#b91c1c'],
    desc: '红色系',
    advice: '今日火气当令，宜穿红色、紫色衣物，有助于增强自信与热情。',
  },
  '土': {
    colors: ['#fbbf24', '#f59e0b', '#d97706', '#b45309'],
    desc: '黄色系',
    advice: '今日土气厚重，宜穿黄色、棕色衣物，有助于稳定情绪与财运。',
  },
  '金': {
    colors: ['#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b'],
    desc: '白色系',
    advice: '今日金气清肃，宜穿白色、银色衣物，有助于提升决断力与效率。',
  },
  '水': {
    colors: ['#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'],
    desc: '蓝色系',
    advice: '今日水气流通，宜穿蓝色、黑色衣物，有助于增强智慧与灵感。',
  },
}

const SHI_CHEN_ADVICE = [
  '子时（23:00-01:00）：宜早睡，养精蓄锐',
  '丑时（01:00-03:00）：宜深睡，肝经当令',
  '寅时（03:00-05:00）：宜早起，肺经活跃',
  '卯时（05:00-07:00）：宜晨练，大肠经通',
  '辰时（07:00-09:00）：宜早餐，胃经当令',
  '巳时（09:00-11:00）：宜工作，脾经运化',
  '午时（11:00-13:00）：宜小憩，心经当令',
  '未时（13:00-15:00）：宜工作，小肠经通',
  '申时（15:00-17:00）：宜运动，膀胱经活',
  '酉时（17:00-19:00）：宜晚餐，肾经当令',
  '戌时（19:00-21:00）：宜休闲，心包经静',
  '亥时（21:00-23:00）：宜准备休息，三焦经通',
]

export default function DressGuidePage() {
  const [today, setToday] = useState<any>(null)
  const [currentShiChen, setCurrentShiChen] = useState(0)

  useEffect(() => {
    setToday(getTodayGanZhi())
    const hour = new Date().getHours()
    setCurrentShiChen(Math.floor(((hour + 1) % 24) / 2))
  }, [])

  if (!today) return null

  const dayGan = today.day.gan
  const dayZhi = today.day.zhi
  const ganWx = getWuXing(dayGan)
  const zhiWx = getWuXing(dayZhi)
  const guide = WUXING_COLORS[ganWx] || WUXING_COLORS['木']

  return (
    <div className="px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/wo" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-gold-gradient text-xl font-bold">五行穿衣</h1>
          <p className="text-moonly-text-muted text-xs">根据今日干支推荐穿搭</p>
        </div>
      </div>

      {/* 今日干支 */}
      <div className="moonly-card p-5 mb-6 text-center">
        <div className="text-moonly-text-muted text-sm mb-1">{today.dateStr}</div>
        <div className="text-2xl font-bold text-gold mb-2">
          {dayGan}{dayZhi}日
        </div>
        <div className="flex justify-center gap-4 text-sm">
          <span className="text-white/60">天干五行：<span className="text-gold">{ganWx}</span></span>
          <span className="text-white/60">地支五行：<span className="text-gold">{zhiWx}</span></span>
        </div>
      </div>

      {/* 推荐颜色 */}
      <div className="moonly-card p-5 mb-6">
        <div className="text-xs text-moonly-gold mb-3 tracking-wider">今日幸运色</div>
        <div className="text-white text-lg font-bold mb-3">{guide.desc}</div>
        <div className="flex gap-3 mb-4">
          {guide.colors.map((color, i) => (
            <div key={i} className="flex-1">
              <div 
                className="w-full aspect-square rounded-xl mb-1" 
                style={{ backgroundColor: color }}
              />
            </div>
          ))}
        </div>
        <p className="text-moonly-text-secondary text-sm leading-relaxed">{guide.advice}</p>
      </div>

      {/* 穿搭建议 */}
      <div className="moonly-card p-4 mb-6">
        <h3 className="text-gold text-sm font-semibold mb-3">💡 穿搭小贴士</h3>
        <ul className="space-y-2 text-sm text-moonly-text-secondary">
          <li className="flex gap-2">
            <span className="text-gold">•</span>
            <span>上衣可选择{guide.desc}为主色调，提升整体气场</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gold">•</span>
            <span>配饰可选用同色系或五行相生色（{ganWx === '木' ? '水色黑蓝' : ganWx === '火' ? '木色青绿' : ganWx === '土' ? '火色红紫' : ganWx === '金' ? '土色黄褐' : '金色白银'}）</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gold">•</span>
            <span>避免大面积使用五行相克色</span>
          </li>
        </ul>
      </div>

      {/* 时辰养生 */}
      <div className="moonly-card p-4">
        <h3 className="text-gold text-sm font-semibold mb-3">⏰ 时辰养生</h3>
        <div className="space-y-2">
          {SHI_CHEN_ADVICE.map((advice, i) => {
            const isCurrent = i === currentShiChen
            return (
              <div 
                key={i} 
                className={`p-2 rounded-lg text-sm ${isCurrent ? 'bg-moonly-gold/10 border border-moonly-gold/20' : 'bg-white/5'}`}
              >
                <div className={`${isCurrent ? 'text-gold font-medium' : 'text-white/60'}`}>
                  {isCurrent && <span className="mr-1">📍</span>}
                  {advice}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
