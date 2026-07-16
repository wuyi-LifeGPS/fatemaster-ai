'use client'

import { useState } from 'react'
import Link from 'next/link'

const PALM_LINES = [
  {
    id: 'life',
    name: '生命线',
    icon: '💪',
    meaning: '代表生命力、健康状况',
    good: '深长清晰、弧度优美 — 主身体健康，精力旺盛',
    bad: '短浅断裂、岛纹杂 — 主体质较弱，需注意健康',
  },
  {
    id: 'head',
    name: '智慧线',
    icon: '🧠',
    meaning: '代表智力、思维方式',
    good: '深长平直、分叉适中 — 主聪慧理性，思维敏捷',
    bad: '短浅弯曲、过直或链纹 — 主思维混乱或偏执',
  },
  {
    id: 'heart',
    name: '感情线',
    icon: '❤️',
    meaning: '代表感情、婚姻、人际关系',
    good: '深长清晰、微微上扬 — 主感情顺利，婚姻美满',
    bad: '短浅断裂、岛纹杂 — 主感情波折，人际多忧',
  },
  {
    id: 'fate',
    name: '命运线',
    icon: '🛤️',
    meaning: '代表事业、命运走向',
    good: '深直清晰、从手腕到中指 — 主事业稳定，命运顺遂',
    bad: '断续浅弱、弯曲多枝 — 主事业多变，命运波折',
  },
  {
    id: 'sun',
    name: '太阳线',
    icon: '☀️',
    meaning: '代表名声、成功、创造力',
    good: '清晰直上、位于无名指下 — 主名声显赫，成功有望',
    bad: '短浅缺失、断裂 — 主默默无闻，需加倍努力',
  },
  {
    id: 'mercury',
    name: '水星线',
    icon: '💰',
    meaning: '代表财运、商业头脑',
    good: '清晰深长、位于小指下 — 主财运亨通，商业敏锐',
    bad: '短浅杂乱 — 主财运一般，理财需谨慎',
  },
  {
    id: 'mars',
    name: '火星线',
    icon: '🔥',
    meaning: '代表意志力、抵抗力',
    good: '清晰有力 — 主意志坚定，抗压能力强',
    bad: '缺失或浅弱 — 主意志力薄弱，易受外界影响',
  },
  {
    id: 'health',
    name: '健康线',
    icon: '💊',
    meaning: '代表健康状态、疾病预警',
    good: '浅而清晰 — 主健康平稳',
    bad: '深而断裂 — 主健康波动，需多加注意',
  },
]

const HAND_TYPES = [
  { type: '火型手', icon: '🔥', desc: '手掌方正、手指较短，主行动力强，性格急躁', traits: '热情、冲动、有领导力' },
  { type: '土型手', icon: '🌍', desc: '手掌厚实、手指粗短，主务实稳重，性格保守', traits: '踏实、可靠、有耐心' },
  { type: '风型手', icon: '💨', desc: '手掌方形、手指较长，主理性思维，善于沟通', traits: '聪明、善辩、好奇心强' },
  { type: '水型手', icon: '💧', desc: '手掌长窄、手指纤细，主感性敏感，富有创意', traits: '浪漫、直觉、艺术天赋' },
]

export default function PalmReadingPage() {
  const [selectedLines, setSelectedLines] = useState<string[]>([])
  const [handType, setHandType] = useState('')
  const [step, setStep] = useState<'hand' | 'lines' | 'result'>('hand')

  const toggleLine = (id: string) => {
    setSelectedLines(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    )
  }

  const analyze = () => {
    if (selectedLines.length === 0) return
    setStep('result')
  }

  const getFortune = () => {
    const score = Math.min(95, Math.max(30, selectedLines.length * 12 + 30))
    if (score >= 80) return { level: '上吉', desc: '手相优良，运势亨通。生命线深长、智慧线清晰，主健康长寿、聪明智慧。', color: 'text-gold' }
    if (score >= 65) return { level: '中吉', desc: '手相中平，局部优良。保持积极心态，努力可改运。', color: 'text-yellow-400' }
    if (score >= 50) return { level: '平', desc: '手相普通，无明显优势。需靠后天修养与努力。', color: 'text-blue-400' }
    return { level: '下', desc: '手相多有不整，建议修心养性，积德行善以改善运势。', color: 'text-red-400' }
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
          <h1 className="text-gold-gradient text-xl font-bold">手相分析</h1>
          <p className="text-moonly-muted text-xs">掌纹解析，命运在手</p>
        </div>
      </div>

      {step === 'hand' && (
        <>
          <div className="moonly-card p-4 mb-6">
            <p className="text-moonly-secondary text-sm leading-relaxed">
              手相学认为手掌形状与纹路反映人的性格与命运。首先选择你的手型，然后选择你掌纹的优势特征。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {HAND_TYPES.map(hand => (
              <button
                key={hand.type}
                onClick={() => { setHandType(hand.type); setStep('lines') }}
                className={`moonly-card p-4 text-left transition ${
                  handType === hand.type
                    ? 'border-[#c9a96e]/50 bg-[#c9a96e]/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="text-2xl mb-2">{hand.icon}</div>
                <div className="text-white text-sm font-medium">{hand.type}</div>
                <div className="text-moonly-muted text-xs mt-1">{hand.desc}</div>
                <div className="text-[#c9a96e] text-xs mt-2">{hand.traits}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'lines' && (
        <>
          <div className="moonly-card p-4 mb-4">
            <div className="text-white text-sm font-medium mb-1">已选手型：{handType}</div>
            <button onClick={() => setStep('hand')} className="text-[#c9a96e] text-xs hover:underline">重新选择</button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {PALM_LINES.map(line => (
              <button
                key={line.id}
                onClick={() => toggleLine(line.id)}
                className={`moonly-card p-4 text-left transition ${
                  selectedLines.includes(line.id)
                    ? 'border-[#c9a96e]/50 bg-[#c9a96e]/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="text-2xl mb-2">{line.icon}</div>
                <div className="text-white text-sm font-medium">{line.name}</div>
                <div className="text-moonly-muted text-xs mt-1">{line.meaning}</div>
                {selectedLines.includes(line.id) && (
                  <div className="mt-2 text-[#c9a96e] text-xs">✓ 已选</div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={analyze}
            disabled={selectedLines.length === 0}
            className="w-full py-3 bg-[#c9a96e]/10 text-[#c9a96e] rounded-xl font-medium hover:bg-[#c9a96e]/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            开始分析（已选 {selectedLines.length} 项）
          </button>
        </>
      )}

      {step === 'result' && (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-4xl mb-3">🖐️</div>
            <div className="text-white text-sm mb-2">手型：{handType}</div>
            <div className={`text-2xl font-bold mb-2 ${getFortune().color}`}>{getFortune().level}</div>
            <div className="text-moonly-secondary text-sm leading-relaxed">{getFortune().desc}</div>
          </div>

          <div className="space-y-3">
            {selectedLines.map(id => {
              const line = PALM_LINES.find(l => l.id === id)
              if (!line) return null
              return (
                <div key={id} className="moonly-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{line.icon}</span>
                    <span className="text-white font-medium text-sm">{line.name}</span>
                  </div>
                  <div className="text-moonly-muted text-xs mb-2">{line.meaning}</div>
                  <div className="text-green-400 text-xs">{line.good}</div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => { setStep('hand'); setSelectedLines([]); setHandType('') }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新分析
          </button>
        </div>
      )}
    </div>
  )
}
