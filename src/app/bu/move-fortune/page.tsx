'use client'

import { useState } from 'react'
import Link from 'next/link'

const DIRECTIONS = [
  { name: '东', icon: '⬅️', meaning: '震卦，主事业、成长' },
  { name: '南', icon: '⬇️', meaning: '离卦，主名声、桃花' },
  { name: '西', icon: '➡️', meaning: '兑卦，主子女、创意' },
  { name: '北', icon: '⬆️', meaning: '坎卦，主事业、智慧' },
  { name: '东南', icon: '↙️', meaning: '巽卦，主财运、人缘' },
  { name: '西南', icon: '↗️', meaning: '坤卦，主婚姻、家庭' },
  { name: '东北', icon: '↘️', meaning: '艮卦，主学业、知识' },
  { name: '西北', icon: '↖️', meaning: '乾卦，主贵人、权力' },
]

const FLOOR_NUMBERS = [
  { floor: '1-3层', meaning: '接地气，适合老人和小孩', luck: 85 },
  { floor: '4-6层', meaning: '适中高度，采光通风好', luck: 90 },
  { floor: '7-9层', meaning: '视野开阔，空气质量好', luck: 88 },
  { floor: '10层以上', meaning: '高高在上，事业运旺', luck: 82 },
]

function getMoveFortune(birthDate: string) {
  const date = new Date(birthDate)
  const today = new Date()
  const combined = date.getDate() + today.getDate()
  const direction = DIRECTIONS[combined % DIRECTIONS.length]
  const floor = FLOOR_NUMBERS[combined % FLOOR_NUMBERS.length]
  const luck = Math.floor(Math.random() * 20) + 80
  
  return {
    direction,
    floor,
    luck,
    color: luck >= 85 ? 'text-green-400' : luck >= 70 ? 'text-yellow-400' : 'text-red-400',
    level: luck >= 85 ? '大吉' : luck >= 70 ? '中吉' : '小吉',
    date: `${today.getMonth() + 1}月${today.getDate()}日`,
  }
}

export default function MoveFortunePage() {
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<any>(null)

  const analyze = () => {
    if (!birthDate) return
    setResult(getMoveFortune(birthDate))
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
          <h1 className="text-gold-gradient text-xl font-bold">搬家运势</h1>
          <p className="text-moonly-text-muted text-xs">乔迁新居，择日而行</p>
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
          查看搬家运势
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-4xl mb-3">🏠</div>
            <div className="text-gold text-2xl font-bold mb-2">搬家运势</div>
            <div className="text-moonly-text-secondary text-sm">{result.date}</div>
            <div className={`text-2xl font-bold mt-4 ${result.color}`}>{result.level}</div>
            <div className="mt-4">
              <div className="text-moonly-text-muted text-xs mb-1">乔迁指数</div>
              <div className="w-full bg-white/5 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    result.luck >= 85 ? 'bg-green-400' : result.luck >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${result.luck}%` }}
                />
              </div>
              <div className={`text-lg font-bold mt-1 ${result.color}`}>{result.luck}分</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="moonly-card p-4 text-center">
              <div className="text-moonly-text-muted text-xs mb-1">吉利方向</div>
              <div className="text-2xl mb-1">{result.direction.icon}</div>
              <div className="text-gold text-lg font-bold">{result.direction.name}</div>
            </div>
            <div className="moonly-card p-4 text-center">
              <div className="text-moonly-text-muted text-xs mb-1">推荐楼层</div>
              <div className="text-gold text-lg font-bold">{result.floor.floor}</div>
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">💡 搬家建议</h3>
            <div className="text-moonly-text-secondary text-sm leading-relaxed space-y-2">
              <p>🧭 {result.direction.meaning}</p>
              <p>🏢 {result.floor.meaning}</p>
              <p>📅 今日{result.luck >= 85 ? '非常适合' : result.luck >= 70 ? '适合' : '谨慎'}搬家</p>
            </div>
          </div>

          <button
            onClick={() => { setBirthDate(''); setResult(null) }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新查看
          </button>
        </div>
      )}
    </div>
  )
}
