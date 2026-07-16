'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getProfiles, BaziProfile } from '@/lib/bazi-profiles'
import { calculateBazi, getWuXing, getShiShen, getCangGan, getYinYang } from '@/lib/bazi'

const WUXING_COLOR: Record<string, string> = {
  '木': '#4ade80', '火': '#f87171', '土': '#fbbf24', '金': '#e2e8f0', '水': '#60a5fa',
}

const COMPATIBILITY_DESC: Record<string, string> = {
  '大吉': '两人八字高度契合，五行互补，是极佳的组合。',
  '吉': '八字相合，性格互补，相处融洽。',
  '平': '八字中性，需双方用心经营关系。',
  '凶': '八字存在冲突，需互相包容理解。',
  '大凶': '八字相冲严重，建议谨慎考虑。',
}

function calculateCompatibility(p1: BaziProfile, p2: BaziProfile): { score: number; level: string; details: string[] } {
  const dateStr1 = `${p1.year}-${String(p1.month).padStart(2, '0')}-${String(p1.day).padStart(2, '0')}`
  const dateStr2 = `${p2.year}-${String(p2.month).padStart(2, '0')}-${String(p2.day).padStart(2, '0')}`
  const bazi1 = calculateBazi(dateStr1, p1.birthTimeLabel)
  const bazi2 = calculateBazi(dateStr2, p2.birthTimeLabel)

  let score = 50
  const details: string[] = []

  // 日主五行关系
  const wx1 = getWuXing(bazi1.dayMaster)
  const wx2 = getWuXing(bazi2.dayMaster)

  if (
    (wx1 === '木' && wx2 === '水') ||
    (wx1 === '火' && wx2 === '木') ||
    (wx1 === '土' && wx2 === '火') ||
    (wx1 === '金' && wx2 === '土') ||
    (wx1 === '水' && wx2 === '金')
  ) {
    score += 15
    details.push(`${p2.name}的五行(${wx2})生${p1.name}的五行(${wx1})，相生关系`)
  } else if (wx1 === wx2) {
    score += 5
    details.push('两人日主五行相同，性格有共鸣')
  } else if (
    (wx1 === '木' && wx2 === '金') ||
    (wx1 === '火' && wx2 === '水') ||
    (wx1 === '土' && wx2 === '木') ||
    (wx1 === '金' && wx2 === '火') ||
    (wx1 === '水' && wx2 === '土')
  ) {
    score -= 10
    details.push(`${p2.name}的五行(${wx2})克${p1.name}的五行(${wx1})，存在克制`)
  }

  // 天干合冲
  const gan1 = bazi1.dayMaster
  const gan2 = bazi2.dayMaster
  const hePairs: Record<string, string> = { '甲': '己', '己': '甲', '乙': '庚', '庚': '乙', '丙': '辛', '辛': '丙', '丁': '壬', '壬': '丁', '戊': '癸', '癸': '戊' }
  if (hePairs[gan1] === gan2) {
    score += 10
    details.push(`天干相合(${gan1}${gan2})，缘分深厚`)
  }

  // 地支合冲
  const zhi1 = bazi1.pillars[2].zhi
  const zhi2 = bazi2.pillars[2].zhi
  const zhiHe: Record<string, string> = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' }
  if (zhiHe[zhi1] === zhi2) {
    score += 8
    details.push(`地支相合(${zhi1}${zhi2})，关系稳固`)
  }

  score = Math.min(95, Math.max(15, score))

  let level: string
  if (score >= 80) level = '大吉'
  else if (score >= 65) level = '吉'
  else if (score >= 45) level = '平'
  else if (score >= 30) level = '凶'
  else level = '大凶'

  return { score, level, details }
}

export default function BaziComparePage() {
  const [profiles, setProfiles] = useState<BaziProfile[]>([])
  const [selected1, setSelected1] = useState<string>('')
  const [selected2, setSelected2] = useState<string>('')
  const [result, setResult] = useState<ReturnType<typeof calculateCompatibility> | null>(null)

  useEffect(() => {
    setProfiles(getProfiles())
  }, [])

  const handleCompare = () => {
    const p1 = profiles.find(p => p.id === selected1)
    const p2 = profiles.find(p => p.id === selected2)
    if (p1 && p2) {
      setResult(calculateCompatibility(p1, p2))
    }
  }

  const p1 = profiles.find(p => p.id === selected1)
  const p2 = profiles.find(p => p.id === selected2)

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/wo" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-gold-gradient text-xl font-bold">八字对比</h1>
          <p className="text-moonly-text-muted text-xs">选择两个八字进行对比分析</p>
        </div>
      </div>

      {/* 选择区域 */}
      <div className="space-y-4 mb-6">
        <div className="moonly-card p-4">
          <label className="text-sm text-moonly-gold mb-2 block">第一个人</label>
          <select
            value={selected1}
            onChange={(e) => { setSelected1(e.target.value); setResult(null) }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a96e]/50"
          >
            <option value="" className="bg-moonly-bg">请选择</option>
            {profiles.map(p => (
              <option key={p.id} value={p.id} className="bg-moonly-bg">
                {p.name} · {p.gender} · {p.year}年{p.month}月{p.day}日
              </option>
            ))}
          </select>
        </div>

        <div className="moonly-card p-4">
          <label className="text-sm text-moonly-gold mb-2 block">第二个人</label>
          <select
            value={selected2}
            onChange={(e) => { setSelected2(e.target.value); setResult(null) }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a96e]/50"
          >
            <option value="" className="bg-moonly-bg">请选择</option>
            {profiles.map(p => (
              <option key={p.id} value={p.id} className="bg-moonly-bg">
                {p.name} · {p.gender} · {p.year}年{p.month}月{p.day}日
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCompare}
          disabled={!selected1 || !selected2 || selected1 === selected2}
          className="w-full py-4 bg-gradient-to-r from-[#c9a96e] to-yellow-500 text-moonly-bg font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {selected1 === selected2 ? '请选择不同的两个人' : '开始对比'}
        </button>
      </div>

      {/* 结果 */}
      {result && p1 && p2 && (
        <div className="space-y-4">
          {/* 评分 */}
          <div className="moonly-card p-5 text-center">
            <div className="text-5xl font-bold text-gold mb-2">{result.score}</div>
            <div className={`text-xl font-medium ${
              result.score >= 65 ? 'text-green-400' : result.score >= 45 ? 'text-slate-400' : 'text-orange-400'
            }`}>
              {result.level}
            </div>
            <p className="text-moonly-text-secondary text-sm mt-3">{COMPATIBILITY_DESC[result.level]}</p>
          </div>

          {/* 八字对比 */}
          <div className="moonly-card p-4">
            <div className="text-xs text-moonly-gold mb-3">八字对比</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-white font-medium mb-2">{p1.name}</div>
                <div className="flex gap-1">
                  {(() => {
                    const dateStr = `${p1.year}-${String(p1.month).padStart(2, '0')}-${String(p1.day).padStart(2, '0')}`
                    return calculateBazi(dateStr, p1.birthTimeLabel).pillars.map((pillar: any, i: number) => (
                      <div key={i} className="flex-1 text-center">
                        <div className="text-sm font-bold" style={{ color: WUXING_COLOR[getWuXing(pillar.gan)] || '#fff' }}>{pillar.gan}</div>
                        <div className="text-sm font-bold" style={{ color: WUXING_COLOR[getWuXing(pillar.zhi)] || '#fff' }}>{pillar.zhi}</div>
                      </div>
                    ))
                  })()}
                </div>
              </div>
              <div>
                <div className="text-white font-medium mb-2">{p2.name}</div>
                <div className="flex gap-1">
                  {(() => {
                    const dateStr = `${p2.year}-${String(p2.month).padStart(2, '0')}-${String(p2.day).padStart(2, '0')}`
                    return calculateBazi(dateStr, p2.birthTimeLabel).pillars.map((pillar: any, i: number) => (
                      <div key={i} className="flex-1 text-center">
                        <div className="text-sm font-bold" style={{ color: WUXING_COLOR[getWuXing(pillar.gan)] || '#fff' }}>{pillar.gan}</div>
                        <div className="text-sm font-bold" style={{ color: WUXING_COLOR[getWuXing(pillar.zhi)] || '#fff' }}>{pillar.zhi}</div>
                      </div>
                    ))
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* 详细分析 */}
          <div className="moonly-card p-4">
            <div className="text-xs text-moonly-gold mb-3">详细分析</div>
            <div className="space-y-2">
              {result.details.map((detail, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-moonly-text-secondary">
                  <span className="text-moonly-gold mt-0.5">•</span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
