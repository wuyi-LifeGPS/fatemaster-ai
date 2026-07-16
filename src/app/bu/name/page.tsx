'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAME_ANALYSIS = {
  strokes: {
    '1-10': { level: '大吉', score: 95, desc: '天地人和，基础稳固，前途光明' },
    '11-20': { level: '吉', score: 85, desc: '运势顺畅，才智出众，事业有成' },
    '21-30': { level: '中吉', score: 75, desc: '平稳发展，需努力方可成功' },
    '31-40': { level: '平', score: 60, desc: '运势普通，平淡是真，知足常乐' },
    '41+': { level: '需谨慎', score: 45, desc: '笔画过多，易有波折，宜简化' },
  },
  elements: {
    '木': { good: '仁慈、正直、有上进心', bad: '固执、不善变通', careers: '教育、文化、艺术、医疗' },
    '火': { good: '热情、礼貌、有领导力', bad: '急躁、易冲动', careers: '演艺、餐饮、能源、科技' },
    '土': { good: '诚实、可靠、有耐心', bad: '保守、缺乏创新', careers: '建筑、农业、地产、金融' },
    '金': { good: '果断、正义、有决断力', bad: '刚愎、不善妥协', careers: '法律、军警、金融、机械' },
    '水': { good: '聪明、灵活、善交际', bad: '多变、缺乏定力', careers: '贸易、物流、旅游、传媒' },
  },
}

const LUCKY_ELEMENTS = ['木', '火', '土', '金', '水']

function calculateStrokes(name: string) {
  // Simplified stroke count estimation based on character complexity
  let strokes = 0
  for (const char of name) {
    // Rough estimation: more complex characters have more strokes
    const code = char.charCodeAt(0)
    if (code >= 0x4e00 && code <= 0x9fff) {
      strokes += Math.max(3, Math.min(20, (code % 15) + 3))
    } else {
      strokes += 1
    }
  }
  return strokes
}

function getElement(name: string) {
  const firstChar = name[0]
  if (!firstChar) return '木'
  const code = firstChar.charCodeAt(0)
  return LUCKY_ELEMENTS[code % 5]
}

// Loading spinner
function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

export default function NameAnalysisPage() {
  const [name, setName] = useState('')
  const [result, setResult] = useState<{
    strokes: number
    element: string
    strokeLevel: typeof NAME_ANALYSIS.strokes[keyof typeof NAME_ANALYSIS.strokes]
    elementAnalysis: typeof NAME_ANALYSIS.elements[keyof typeof NAME_ANALYSIS.elements]
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const analyze = () => {
    if (!name.trim()) return
    setLoading(true)
    setTimeout(() => {
      const strokes = calculateStrokes(name)
      const element = getElement(name)

      let strokeLevel
      if (strokes <= 10) strokeLevel = NAME_ANALYSIS.strokes['1-10']
      else if (strokes <= 20) strokeLevel = NAME_ANALYSIS.strokes['11-20']
      else if (strokes <= 30) strokeLevel = NAME_ANALYSIS.strokes['21-30']
      else if (strokes <= 40) strokeLevel = NAME_ANALYSIS.strokes['31-40']
      else strokeLevel = NAME_ANALYSIS.strokes['41+']

      setResult({
        strokes,
        element,
        strokeLevel,
        elementAnalysis: NAME_ANALYSIS.elements[element as keyof typeof NAME_ANALYSIS.elements],
      })
      setLoading(false)
    }, 600)
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
          <h1 className="text-gold-gradient text-xl font-bold">姓名分析</h1>
          <p className="text-moonly-text-muted text-xs">笔画五行，解读姓名</p>
        </div>
      </div>

      {/* Input */}
      <div className="moonly-card p-4 mb-6">
        <label className="text-white text-sm font-medium mb-2 block">输入姓名</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="请输入姓名（2-4字）"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-moonly-gold/30 mb-3"
        />
        <button
          onClick={analyze}
          disabled={!name.trim() || loading}
          className="w-full py-3 btn-gold text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <><Spinner /> 分析中...</> : '分析姓名'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="moonly-card p-6 text-center">
            <div className="text-4xl mb-3">✨</div>
            <div className="text-white text-lg font-bold mb-1">{name}</div>
            <div className={`text-2xl font-bold mb-2 ${result.strokeLevel.score >= 80 ? 'text-gold' : result.strokeLevel.score >= 60 ? 'text-yellow-400' : 'text-orange-400'}`}>
              {result.strokeLevel.level}
            </div>
            <div className="text-moonly-text-secondary text-sm leading-relaxed">
              {result.strokeLevel.desc}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="moonly-card p-4 text-center">
              <div className="text-moonly-text-muted text-xs mb-1">总笔画</div>
              <div className="text-gold text-2xl font-bold">{result.strokes}</div>
            </div>
            <div className="moonly-card p-4 text-center">
              <div className="text-moonly-text-muted text-xs mb-1">五行属性</div>
              <div className="text-gold text-2xl font-bold">{result.element}</div>
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">五行分析</h3>
            <div className="space-y-2">
              <div className="text-green-400 text-sm">✓ {result.elementAnalysis.good}</div>
              <div className="text-orange-400 text-sm">⚠ {result.elementAnalysis.bad}</div>
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">适合职业</h3>
            <div className="text-moonly-text-secondary text-sm">
              {result.elementAnalysis.careers}
            </div>
          </div>

          <button
            onClick={() => { setName(''); setResult(null) }}
            className="w-full py-3 btn-gold-outline text-sm font-semibold"
          >
            重新分析
          </button>
        </div>
      )}
    </div>
  )
}
