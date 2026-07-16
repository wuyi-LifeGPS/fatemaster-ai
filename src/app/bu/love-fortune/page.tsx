'use client'

import { useState } from 'react'
import Link from 'next/link'

const LOVE_TYPES = [
  { type: '单身', icon: '💘', advice: '今日桃花运不错，适合参加社交活动。' },
  { type: '暗恋', icon: '💕', advice: '今日适合表白，成功率较高。' },
  { type: '热恋', icon: '❤️', advice: '今日感情甜蜜，适合约会。' },
  { type: '冷战', icon: '💔', advice: '今日适合沟通化解误会。' },
  { type: '分手', icon: '😢', advice: '今日不宜冲动，冷静思考。' },
  { type: '复合', icon: '💞', advice: '今日有机会重修旧好。' },
]

function getLoveFortune(loveType: string, birthDate: string) {
  const love = LOVE_TYPES.find(l => l.type === loveType)
  if (!love) return null
  
  const date = new Date(birthDate)
  const today = new Date()
  const combined = date.getDate() + today.getDate()
  const luck = Math.floor(Math.random() * 30) + 70
  const luckyColors = ['红色', '粉色', '紫色', '白色']
  const luckyNumbers = ['3', '6', '9', '12']
  
  return {
    ...love,
    luck,
    luckyColor: luckyColors[combined % luckyColors.length],
    luckyNumber: luckyNumbers[combined % luckyNumbers.length],
    color: luck >= 85 ? 'text-red-400' : luck >= 70 ? 'text-pink-400' : 'text-purple-400',
    level: luck >= 85 ? '大吉' : luck >= 70 ? '中吉' : '小吉',
  }
}

export default function LoveFortunePage() {
  const [loveType, setLoveType] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<any>(null)

  const analyze = () => {
    if (!loveType || !birthDate) return
    setResult(getLoveFortune(loveType, birthDate))
  }

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/bu" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-gold-gradient text-xl font-bold">恋爱运势</h1>
          <p className="text-moonly-muted text-xs">桃花运来，缘分天定</p>
        </div>
      </div>

      {!result ? (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {LOVE_TYPES.map(love => (
              <button
                key={love.type}
                onClick={() => setLoveType(love.type)}
                className={`moonly-card p-4 text-center transition ${
                  loveType === love.type
                    ? 'border-[#c9a96e]/50 bg-[#c9a96e]/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="text-3xl mb-2">{love.icon}</div>
                <div className="text-white text-sm font-medium">{love.type}</div>
              </button>
            ))}
          </div>

          <div className="moonly-card p-4 mb-6">
            <label className="text-white text-sm font-medium mb-2 block">出生日期</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#c9a96e]/30"
            />
          </div>

          <button
            onClick={analyze}
            disabled={!loveType || !birthDate}
            className="w-full py-3 btn-gold text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
          >
            查看恋爱运势
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-5xl mb-3">{result.icon}</div>
            <div className="text-gold text-2xl font-bold mb-2">{result.type}运势</div>
            <div className={`text-2xl font-bold mt-4 ${result.color}`}>{result.level}</div>
            <div className="mt-4">
              <div className="text-moonly-muted text-xs mb-1">桃花指数</div>
              <div className="w-full bg-white/5 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    result.luck >= 85 ? 'bg-red-400' : result.luck >= 70 ? 'bg-pink-400' : 'bg-purple-400'
                  }`}
                  style={{ width: `${result.luck}%` }}
                />
              </div>
              <div className={`text-lg font-bold mt-1 ${result.color}`}>{result.luck}分</div>
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">💡 恋爱建议</h3>
            <div className="text-moonly-secondary text-sm leading-relaxed">
              {result.advice}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="moonly-card p-4 text-center">
              <div className="text-moonly-muted text-xs mb-1">幸运颜色</div>
              <div className="text-gold text-lg font-bold">{result.luckyColor}</div>
            </div>
            <div className="moonly-card p-4 text-center">
              <div className="text-moonly-muted text-xs mb-1">幸运数字</div>
              <div className="text-gold text-lg font-bold">{result.luckyNumber}</div>
            </div>
          </div>

          <button
            onClick={() => { setResult(null); setLoveType(''); setBirthDate('') }}
            className="w-full py-3 btn-gold-outline text-sm font-semibold"
          >
            重新查看
          </button>
        </div>
      )}
    </div>
  )
}
