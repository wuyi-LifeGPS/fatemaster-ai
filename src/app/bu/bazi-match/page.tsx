'use client'

import { useState } from 'react'
import Link from 'next/link'

const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const WUXING = ['木', '火', '土', '金', '水']

function getGanZhi(year: number, month: number, day: number) {
  const yearGan = TIAN_GAN[(year - 4) % 10]
  const yearZhi = DI_ZHI[(year - 4) % 12]
  const monthGan = TIAN_GAN[(year * 2 + month) % 10]
  const monthZhi = DI_ZHI[(month + 2) % 12]
  const dayGan = TIAN_GAN[(year * 5 + month * 3 + day) % 10]
  const dayZhi = DI_ZHI[(year + month + day) % 12]
  return { year: `${yearGan}${yearZhi}`, month: `${monthGan}${monthZhi}`, day: `${dayGan}${dayZhi}` }
}

function getWuxing(ganZhi: string) {
  const gan = ganZhi[0]
  const ganIndex = TIAN_GAN.indexOf(gan)
  return WUXING[ganIndex % 5]
}

function getCompatibility(person1: any, person2: any) {
  const wuxing1 = getWuxing(person1.day)
  const wuxing2 = getWuxing(person2.day)
  
  let score = 70
  let desc = ''
  
  if (wuxing1 === wuxing2) {
    score += 10
    desc = '五行相同，性格相合，有共同语言。'
  } else if ((wuxing1 === '木' && wuxing2 === '火') || 
             (wuxing1 === '火' && wuxing2 === '土') || 
             (wuxing1 === '土' && wuxing2 === '金') || 
             (wuxing1 === '金' && wuxing2 === '水') || 
             (wuxing1 === '水' && wuxing2 === '木')) {
    score += 15
    desc = '五行相生，互为贵人，感情和谐。'
  } else if ((wuxing1 === '木' && wuxing2 === '金') || 
             (wuxing1 === '火' && wuxing2 === '水') || 
             (wuxing1 === '土' && wuxing2 === '木') || 
             (wuxing1 === '金' && wuxing2 === '火') || 
             (wuxing1 === '水' && wuxing2 === '土')) {
    score -= 10
    desc = '五行相克，性格差异较大，需要互相包容。'
  } else {
    desc = '五行相合，性格互补，需要磨合。'
  }
  
  return { score, desc }
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

export default function BaziMatchPage() {
  const [person1, setPerson1] = useState({ name: '', birthDate: '', gender: '男' as '男' | '女' })
  const [person2, setPerson2] = useState({ name: '', birthDate: '', gender: '女' as '男' | '女' })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const analyze = () => {
    if (!person1.birthDate || !person2.birthDate) return
    setLoading(true)
    
    setTimeout(() => {
      const date1 = new Date(person1.birthDate)
      const date2 = new Date(person2.birthDate)
      const bazi1 = getGanZhi(date1.getFullYear(), date1.getMonth() + 1, date1.getDate())
      const bazi2 = getGanZhi(date2.getFullYear(), date2.getMonth() + 1, date2.getDate())
      const compatibility = getCompatibility(bazi1, bazi2)
      
      setResult({
        person1: { ...person1, bazi: bazi1 },
        person2: { ...person2, bazi: bazi2 },
        ...compatibility
      })
      setLoading(false)
    }, 800)
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
          <h1 className="text-gold-gradient text-xl font-bold">八字合婚</h1>
          <p className="text-moonly-text-muted text-xs">八字配对，缘分天定</p>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-4 mb-6">
        <div className="moonly-card p-4">
          <h3 className="text-gold text-sm font-semibold mb-3">男方信息</h3>
          <input
            value={person1.name}
            onChange={e => setPerson1({ ...person1, name: e.target.value })}
            placeholder="姓名"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#c9a96e]/30 mb-3"
          />
          <input
            type="date"
            value={person1.birthDate}
            onChange={e => setPerson1({ ...person1, birthDate: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#c9a96e]/30"
          />
        </div>

        <div className="moonly-card p-4">
          <h3 className="text-gold text-sm font-semibold mb-3">女方信息</h3>
          <input
            value={person2.name}
            onChange={e => setPerson2({ ...person2, name: e.target.value })}
            placeholder="姓名"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#c9a96e]/30 mb-3"
          />
          <input
            type="date"
            value={person2.birthDate}
            onChange={e => setPerson2({ ...person2, birthDate: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#c9a96e]/30"
          />
        </div>

        <button
          onClick={analyze}
          disabled={!person1.birthDate || !person2.birthDate || loading}
          className="w-full py-3 btn-gold text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <><Spinner /> 分析中...</> : '合婚分析'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="moonly-card p-6 text-center">
            <div className="text-4xl mb-3">💕</div>
            <div className="text-gold text-2xl font-bold mb-2">合婚结果</div>
            <div className="text-moonly-text-secondary text-sm leading-relaxed">
              {result.desc}
            </div>
            <div className="mt-4">
              <div className="text-moonly-text-muted text-xs mb-1">匹配指数</div>
              <div className="w-full bg-white/5 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-moonly-gold to-yellow-400 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <div className="text-gold text-lg font-bold mt-1">{result.score}分</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="moonly-card p-4">
              <div className="text-white font-medium text-sm mb-2">{result.person1.name || '男方'}</div>
              <div className="text-gold text-lg font-bold mb-1">{result.person1.bazi.year}</div>
              <div className="text-moonly-text-muted text-xs">{result.person1.bazi.month} {result.person1.bazi.day}</div>
            </div>
            <div className="moonly-card p-4">
              <div className="text-white font-medium text-sm mb-2">{result.person2.name || '女方'}</div>
              <div className="text-gold text-lg font-bold mb-1">{result.person2.bazi.year}</div>
              <div className="text-moonly-text-muted text-xs">{result.person2.bazi.month} {result.person2.bazi.day}</div>
            </div>
          </div>

          <button
            onClick={() => { setResult(null); setPerson1({ name: '', birthDate: '', gender: '男' }); setPerson2({ name: '', birthDate: '', gender: '女' }) }}
            className="w-full py-3 btn-gold-outline text-sm font-semibold"
          >
            重新合婚
          </button>
        </div>
      )}
    </div>
  )
}
