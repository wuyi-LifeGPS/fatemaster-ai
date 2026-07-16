'use client'

import { useState } from 'react'
import Link from 'next/link'

const DIRECTIONS = [
  { name: '东', icon: '⬅️', advice: '东方利于求财，适合商务出行。' },
  { name: '南', icon: '⬇️', advice: '南方利于社交，适合度假旅行。' },
  { name: '西', icon: '➡️', advice: '西方利于创意，适合文化之旅。' },
  { name: '北', icon: '⬆️', advice: '北方利于事业，适合工作出差。' },
  { name: '东南', icon: '↙️', advice: '东南利于人缘，适合结伴出游。' },
  { name: '西南', icon: '↗️', advice: '西南利于婚姻，适合蜜月旅行。' },
  { name: '东北', icon: '↘️', advice: '东北利于学业，适合游学考察。' },
  { name: '西北', icon: '↖️', advice: '西北利于贵人，适合拜访客户。' },
]

const TRAVEL_TYPES = [
  { type: '商务出行', icon: '💼', advice: '今日宜穿正装，携带名片。' },
  { type: '度假旅行', icon: '🏖️', advice: '今日适合海边度假，放松心情。' },
  { type: '探亲访友', icon: '👨‍👩‍👧‍👦', advice: '今日适合家庭聚会，增进感情。' },
  { type: '求学考察', icon: '🎓', advice: '今日适合参观博物馆、图书馆。' },
]

function getTravelFortune(birthDate: string) {
  const date = new Date(birthDate)
  const today = new Date()
  const combined = date.getDate() + today.getDate()
  const direction = DIRECTIONS[combined % DIRECTIONS.length]
  const travelType = TRAVEL_TYPES[combined % TRAVEL_TYPES.length]
  const luck = Math.floor(Math.random() * 30) + 70
  
  return {
    direction,
    travelType,
    luck,
    time: '辰时（7-9点）',
    advice: '出行前检查证件和行李，注意交通安全。',
  }
}

export default function TravelFortunePage() {
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<any>(null)

  const analyze = () => {
    if (!birthDate) return
    setResult(getTravelFortune(birthDate))
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
          <h1 className="text-gold-gradient text-xl font-bold">旅行运势</h1>
          <p className="text-moonly-muted text-xs">出行吉时，平安顺遂</p>
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
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#c9a96e]/30"
          />
        </div>
        <button
          onClick={analyze}
          disabled={!birthDate}
          className="w-full py-3 btn-gold text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
        >
          查看旅行运势
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-4xl mb-3">✈️</div>
            <div className="text-gold text-2xl font-bold mb-2">今日旅行运势</div>
            <div className="mt-4">
              <div className="text-moonly-muted text-xs mb-1">出行指数</div>
              <div className="w-full bg-white/5 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${result.luck}%` }}
                />
              </div>
              <div className="text-blue-400 text-lg font-bold mt-1">{result.luck}分</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="moonly-card p-4 text-center">
              <div className="text-moonly-muted text-xs mb-1">吉利方向</div>
              <div className="text-2xl mb-1">{result.direction.icon}</div>
              <div className="text-gold text-lg font-bold">{result.direction.name}</div>
            </div>
            <div className="moonly-card p-4 text-center">
              <div className="text-moonly-muted text-xs mb-1">适宜类型</div>
              <div className="text-2xl mb-1">{result.travelType.icon}</div>
              <div className="text-gold text-lg font-bold">{result.travelType.type}</div>
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">💡 出行建议</h3>
            <div className="text-moonly-secondary text-sm leading-relaxed space-y-2">
              <p>🧭 {result.direction.advice}</p>
              <p>🎯 {result.travelType.advice}</p>
              <p>⏰ 吉时：{result.time}</p>
              <p>⚠️ {result.advice}</p>
            </div>
          </div>

          <button
            onClick={() => { setBirthDate(''); setResult(null) }}
            className="w-full py-3 btn-gold-outline text-sm font-semibold"
          >
            重新查看
          </button>
        </div>
      )}
    </div>
  )
}
