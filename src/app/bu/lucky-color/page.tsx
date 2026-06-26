'use client'

import { useState } from 'react'
import Link from 'next/link'

const COLORS = [
  { name: '红色', hex: '#EF4444', meaning: '热情、活力、桃花', wuxing: '火' },
  { name: '橙色', hex: '#F97316', meaning: '温暖、创意、社交', wuxing: '火' },
  { name: '黄色', hex: '#EAB308', meaning: '财富、智慧、光明', wuxing: '土' },
  { name: '绿色', hex: '#22C55E', meaning: '生机、健康、成长', wuxing: '木' },
  { name: '青色', hex: '#06B6D4', meaning: '清新、平和、沟通', wuxing: '木' },
  { name: '蓝色', hex: '#3B82F6', meaning: '冷静、智慧、事业', wuxing: '水' },
  { name: '紫色', hex: '#A855F7', meaning: '高贵、神秘、灵性', wuxing: '火' },
  { name: '白色', hex: '#F8FAFC', meaning: '纯洁、简洁、开始', wuxing: '金' },
  { name: '黑色', hex: '#1E293B', meaning: '沉稳、神秘、内敛', wuxing: '水' },
  { name: '粉色', hex: '#EC4899', meaning: '浪漫、温柔、爱情', wuxing: '火' },
]

function getDailyColor(birthDate: string) {
  const date = new Date(birthDate)
  const today = new Date()
  const combined = date.getDate() + date.getMonth() + today.getDate() + today.getMonth()
  return COLORS[combined % COLORS.length]
}

export default function LuckyColorPage() {
  const [birthDate, setBirthDate] = useState('')
  const [luckyColor, setLuckyColor] = useState<typeof COLORS[0] | null>(null)

  const analyze = () => {
    if (!birthDate) return
    setLuckyColor(getDailyColor(birthDate))
  }

  return (
    <div className="px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/bu" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-gold-gradient text-xl font-bold">幸运颜色</h1>
          <p className="text-moonly-text-muted text-xs">每日幸运颜色，穿衣搭配</p>
        </div>
      </div>

      {/* Input */}
      <div className="moonly-card p-4 mb-6">
        <div className="mb-4">
          <label className="text-white text-sm font-medium mb-2 block">出生日期</label>
          <input
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-moonly-gold/30"
          />
        </div>
        <button
          onClick={analyze}
          disabled={!birthDate}
          className="w-full py-3 bg-moonly-gold/10 text-moonly-gold rounded-xl font-medium hover:bg-moonly-gold/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          查看幸运颜色
        </button>
      </div>

      {/* Result */}
      {luckyColor && (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-4xl mb-3">🎨</div>
            <div className="text-white text-lg font-bold mb-2">今日幸运颜色</div>
            <div 
              className="w-24 h-24 rounded-full mx-auto mb-3"
              style={{ backgroundColor: luckyColor.hex }}
            />
            <div className="text-gold text-2xl font-bold mb-2">{luckyColor.name}</div>
            <div className="text-moonly-text-secondary text-sm">{luckyColor.meaning}</div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">💡 搭配建议</h3>
            <div className="text-moonly-text-secondary text-sm leading-relaxed">
              今日宜穿{luckyColor.name}系衣物，或佩戴{luckyColor.name}饰品。五行属{luckyColor.wuxing}，可增强运势。
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">🎨 推荐搭配</h3>
            <div className="flex gap-2">
              {COLORS.slice(0, 5).map(c => (
                <div key={c.name} className="flex-1 text-center">
                  <div 
                    className="w-8 h-8 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div className="text-white text-xs">{c.name}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => { setBirthDate(''); setLuckyColor(null) }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新查看
          </button>
        </div>
      )}
    </div>
  )
}
