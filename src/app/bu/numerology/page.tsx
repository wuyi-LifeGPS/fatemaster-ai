'use client'

import { useState } from 'react'
import Link from 'next/link'

function calculateLifePathNumber(birthDate: string) {
  const digits = birthDate.replace(/\D/g, '')
  let sum = 0
  for (const digit of digits) {
    sum += parseInt(digit)
  }
  while (sum > 9) {
    let newSum = 0
    for (const digit of sum.toString()) {
      newSum += parseInt(digit)
    }
    sum = newSum
  }
  return sum
}

function calculateDestinyNumber(name: string) {
  const letterValues: Record<string, number> = {
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
    j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
    s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
  }
  let sum = 0
  for (const char of name.toLowerCase()) {
    if (letterValues[char]) {
      sum += letterValues[char]
    }
  }
  while (sum > 9) {
    let newSum = 0
    for (const digit of sum.toString()) {
      newSum += parseInt(digit)
    }
    sum = newSum
  }
  return sum
}

const NUMBER_MEANINGS: Record<number, { title: string; traits: string; careers: string; advice: string }> = {
  1: { title: '领导者', traits: '独立、自信、有主见、创造力强', careers: '企业家、管理者、发明家', advice: '学会倾听他人，避免过于自我中心' },
  2: { title: '协调者', traits: '敏感、直觉、合作、善解人意', careers: '外交官、心理咨询师、调解员', advice: '建立自信，不要过度依赖他人' },
  3: { title: '创造者', traits: '乐观、表达、社交、艺术天赋', careers: '艺术家、作家、演员、主持人', advice: '专注目标，避免分散精力' },
  4: { title: '建设者', traits: '务实、可靠、勤奋、有秩序', careers: '工程师、会计师、建筑师', advice: '学会放松，接受变化' },
  5: { title: '自由者', traits: '冒险、好奇、适应力强、多才多艺', careers: '旅行家、记者、销售、自由职业', advice: '培养耐心，避免冲动决定' },
  6: { title: '守护者', traits: '责任、关爱、家庭、治愈', careers: '教师、医生、社工、咨询师', advice: '设立边界，不要过度付出' },
  7: { title: '探索者', traits: '分析、内省、精神追求、求知欲', careers: '研究员、哲学家、科学家', advice: '平衡理性与感性，多与人交流' },
  8: { title: '成就者', traits: '野心、商业头脑、权力、物质成功', careers: '企业家、投资人、高管', advice: '平衡物质与精神，关注人际关系' },
  9: { title: '人道者', traits: '博爱、智慧、奉献、理想主义', careers: '慈善家、艺术家、治疗师', advice: '学会放下，接受不完美' },
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

export default function NumerologyPage() {
  const [birthDate, setBirthDate] = useState('')
  const [name, setName] = useState('')
  const [result, setResult] = useState<{
    lifePath: number
    destiny: number
    lifePathMeaning: typeof NUMBER_MEANINGS[1]
    destinyMeaning: typeof NUMBER_MEANINGS[1]
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const analyze = () => {
    if (!birthDate) return
    setLoading(true)
    setTimeout(() => {
      const lifePath = calculateLifePathNumber(birthDate)
      const destiny = name ? calculateDestinyNumber(name) : 0

      setResult({
        lifePath,
        destiny,
        lifePathMeaning: NUMBER_MEANINGS[lifePath],
        destinyMeaning: destiny ? NUMBER_MEANINGS[destiny] : null as any,
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
          <h1 className="text-gold-gradient text-xl font-bold">数字命理</h1>
          <p className="text-moonly-muted text-xs">生命灵数，数字能量</p>
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
        <div className="mb-4">
          <label className="text-white text-sm font-medium mb-2 block">姓名（拼音）</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="输入姓名拼音（可选）"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#c9a96e]/30"
          />
        </div>
        <button
          onClick={analyze}
          disabled={!birthDate || loading}
          className="w-full py-3 btn-gold text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <><Spinner /> 分析中...</> : '分析数字命理'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="moonly-card p-6 text-center">
            <div className="text-4xl mb-3">🔢</div>
            <div className="text-white text-lg font-bold mb-1">你的生命灵数</div>
            <div className="text-gold text-4xl font-bold mb-2">{result.lifePath}</div>
            <div className="text-[#c9a96e] text-sm font-medium">{result.lifePathMeaning.title}</div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">生命灵数特质</h3>
            <div className="text-moonly-secondary text-sm leading-relaxed">
              {result.lifePathMeaning.traits}
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">适合职业</h3>
            <div className="text-moonly-secondary text-sm leading-relaxed">
              {result.lifePathMeaning.careers}
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">人生建议</h3>
            <div className="text-moonly-secondary text-sm leading-relaxed">
              {result.lifePathMeaning.advice}
            </div>
          </div>

          {result.destiny > 0 && (
            <div className="moonly-card p-4">
              <h3 className="text-gold text-sm font-semibold mb-3">命运数（姓名）: {result.destiny}</h3>
              <div className="text-moonly-secondary text-sm leading-relaxed">
                {result.destinyMeaning.title} — {result.destinyMeaning.traits}
              </div>
            </div>
          )}

          <button
            onClick={() => { setBirthDate(''); setName(''); setResult(null) }}
            className="w-full py-3 btn-gold-outline text-sm font-semibold"
          >
            重新分析
          </button>
        </div>
      )}
    </div>
  )
}
