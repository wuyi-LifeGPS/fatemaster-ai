'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const LUCKY_NUMBERS = [
  { number: 1, meaning: '独立、领导、开创', color: 'text-red-400' },
  { number: 2, meaning: '合作、平衡、和谐', color: 'text-orange-400' },
  { number: 3, meaning: '创意、表达、社交', color: 'text-yellow-400' },
  { number: 4, meaning: '稳定、务实、秩序', color: 'text-green-400' },
  { number: 5, meaning: '自由、变化、冒险', color: 'text-blue-400' },
  { number: 6, meaning: '责任、家庭、关爱', color: 'text-indigo-400' },
  { number: 7, meaning: '智慧、内省、精神', color: 'text-purple-400' },
  { number: 8, meaning: '财富、权力、成就', color: 'text-pink-400' },
  { number: 9, meaning: '博爱、智慧、奉献', color: 'text-rose-400' },
]

function generateDailyLuckyNumber(birthDate: string) {
  const date = new Date(birthDate)
  const today = new Date()
  const combined = date.getDate() + date.getMonth() + today.getDate() + today.getMonth()
  return (combined % 9) + 1
}

function generateLuckyNumbers(birthDate: string) {
  const base = generateDailyLuckyNumber(birthDate)
  return [
    base,
    ((base + 3) % 9) + 1,
    ((base + 6) % 9) + 1,
  ]
}

export default function LuckyNumberPage() {
  const [birthDate, setBirthDate] = useState('')
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([])
  const [mainNumber, setMainNumber] = useState(0)

  const analyze = () => {
    if (!birthDate) return
    const numbers = generateLuckyNumbers(birthDate)
    setLuckyNumbers(numbers)
    setMainNumber(generateDailyLuckyNumber(birthDate))
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
          <h1 className="text-gold-gradient text-xl font-bold">幸运数字</h1>
          <p className="text-moonly-text-muted text-xs">每日幸运数字，趋吉避凶</p>
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
          生成幸运数字
        </button>
      </div>

      {/* Result */}
      {mainNumber > 0 && (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-4xl mb-3">🎰</div>
            <div className="text-white text-lg font-bold mb-2">今日幸运数字</div>
            <div className={`text-5xl font-bold mb-2 ${LUCKY_NUMBERS[mainNumber - 1]?.color || 'text-gold'}`}>
              {mainNumber}
            </div>
            <div className="text-moonly-text-secondary text-sm">
              {LUCKY_NUMBERS[mainNumber - 1]?.meaning}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {luckyNumbers.map((num, i) => (
              <div key={i} className="moonly-card p-4 text-center">
                <div className="text-moonly-text-muted text-xs mb-1">
                  {i === 0 ? '主数字' : i === 1 ? '辅数字' : '吉数字'}
                </div>
                <div className={`text-2xl font-bold ${LUCKY_NUMBERS[num - 1]?.color || 'text-gold'}`}>
                  {num}
                </div>
              </div>
            ))}
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">💡 数字能量</h3>
            <div className="text-moonly-text-secondary text-sm leading-relaxed">
              数字{mainNumber}代表{LUCKY_NUMBERS[mainNumber - 1]?.meaning}。今日适合选择与{mainNumber}相关的事物，如{mainNumber}点、{mainNumber}楼、{mainNumber}号等。
            </div>
          </div>

          <button
            onClick={() => { setBirthDate(''); setMainNumber(0); setLuckyNumbers([]) }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新生成
          </button>
        </div>
      )}
    </div>
  )
}
