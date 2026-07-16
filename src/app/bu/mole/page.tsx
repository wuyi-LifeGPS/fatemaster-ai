'use client'

import { useState } from 'react'
import Link from 'next/link'

const MOLE_POSITIONS = [
  { id: 'forehead', name: '额头', icon: '👆', meaning: '主智慧与早年运势', good: '聪明智慧，早年得志', bad: '思虑过多，早年奔波' },
  { id: 'eyebrow', name: '眉间', icon: '👁️', meaning: '主感情与人际', good: '感情丰富，人缘佳', bad: '感情波折，易招桃花' },
  { id: 'eye', name: '眼周', icon: '👀', meaning: '主魅力与桃花', good: '魅力出众，桃花旺盛', bad: '感情复杂，易惹是非' },
  { id: 'nose', name: '鼻子', icon: '👃', meaning: '主财运与自我', good: '财运亨通，自尊心强', bad: '财运波折，易漏财' },
  { id: 'cheek', name: '脸颊', icon: '😊', meaning: '主福气与人缘', good: '福气深厚，人缘好', bad: '易招小人，口舌是非' },
  { id: 'mouth', name: '嘴角', icon: '👄', meaning: '主食禄与口才', good: '口才出众，食禄丰厚', bad: '言语招祸，易惹是非' },
  { id: 'chin', name: '下巴', icon: '👇', meaning: '主晚年运与不动产', good: '晚年安逸，不动产丰', bad: '晚年孤独，居无定所' },
  { id: 'neck', name: '颈部', icon: '🦒', meaning: '主健康与责任', good: '健康长寿，责任心强', bad: '健康波动，负担较重' },
  { id: 'chest', name: '胸部', icon: '💗', meaning: '主感情与家庭', good: '感情专一，家庭和睦', bad: '感情多变，家庭波折' },
  { id: 'back', name: '背部', icon: '👤', meaning: '主贵人运与靠山', good: '贵人相助，有靠山', bad: '缺乏依靠，独自打拼' },
  { id: 'hand', name: '手掌', icon: '✋', meaning: '主财运与掌控', good: '财运亨通，掌控力强', bad: '财运不稳，易漏财' },
  { id: 'foot', name: '脚底', icon: '🦶', meaning: '主奔波与根基', good: '根基稳固，步步高升', bad: '奔波劳碌，根基不稳' },
]

export default function MoleReadingPage() {
  const [selectedMoles, setSelectedMoles] = useState<string[]>([])
  const [result, setResult] = useState<{
    score: number
    level: string
    desc: string
  } | null>(null)

  const toggleMole = (id: string) => {
    setSelectedMoles(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  const analyze = () => {
    if (selectedMoles.length === 0) return
    const score = Math.min(95, Math.max(30, selectedMoles.length * 12 + 30))
    let level, desc
    if (score >= 80) {
      level = '上吉'
      desc = '痣相优良，福泽深厚。你所选部位多为吉痣，主运势亨通，贵人相助。'
    } else if (score >= 60) {
      level = '中吉'
      desc = '痣相中平，吉凶参半。保持积极心态，善念可改运。'
    } else {
      level = '平'
      desc = '痣相普通，需多加注意。建议修心养性，积德行善。'
    }
    setResult({ score, level, desc })
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
          <h1 className="text-gold-gradient text-xl font-bold">痣相分析</h1>
          <p className="text-moonly-muted text-xs">痣的位置，揭示命运</p>
        </div>
      </div>

      {!result ? (
        <>
          <div className="moonly-card p-4 mb-6">
            <p className="text-moonly-secondary text-sm leading-relaxed">
              痣相学认为痣的位置与命运息息相关。选择你身上的痣所在部位，AI将为你分析综合运势。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {MOLE_POSITIONS.map(mole => (
              <button
                key={mole.id}
                onClick={() => toggleMole(mole.id)}
                className={`moonly-card p-4 text-left transition ${
                  selectedMoles.includes(mole.id)
                    ? 'border-[#c9a96e]/50 bg-[#c9a96e]/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="text-2xl mb-2">{mole.icon}</div>
                <div className="text-white text-sm font-medium">{mole.name}</div>
                <div className="text-moonly-muted text-xs mt-1">{mole.meaning}</div>
                {selectedMoles.includes(mole.id) && (
                  <div className="mt-2 text-[#c9a96e] text-xs">✓ 已选</div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={analyze}
            disabled={selectedMoles.length === 0}
            className="w-full py-3 bg-[#c9a96e]/10 text-[#c9a96e] rounded-xl font-medium hover:bg-[#c9a96e]/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            开始分析（已选 {selectedMoles.length} 项）
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-4xl mb-3">🔮</div>
            <div className={`text-2xl font-bold mb-2 ${result.score >= 80 ? 'text-gold' : result.score >= 60 ? 'text-yellow-400' : 'text-blue-400'}`}>
              {result.level}
            </div>
            <div className="text-moonly-secondary text-sm leading-relaxed">
              {result.desc}
            </div>
            <div className="mt-4">
              <div className="text-moonly-muted text-xs mb-1">运势指数</div>
              <div className="w-full bg-white/5 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-[#c9a96e] to-yellow-400 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <div className="text-gold text-lg font-bold mt-1">{result.score}分</div>
            </div>
          </div>

          <div className="space-y-3">
            {selectedMoles.map(id => {
              const mole = MOLE_POSITIONS.find(m => m.id === id)
              if (!mole) return null
              return (
                <div key={id} className="moonly-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{mole.icon}</span>
                    <span className="text-white font-medium text-sm">{mole.name}</span>
                  </div>
                  <div className="text-moonly-muted text-xs mb-2">{mole.meaning}</div>
                  <div className="text-green-400 text-xs">{mole.good}</div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => { setResult(null); setSelectedMoles([]) }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新分析
          </button>
        </div>
      )}
    </div>
  )
}
