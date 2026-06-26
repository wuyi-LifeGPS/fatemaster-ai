'use client'

import { useState, useMemo } from 'react'
import { TIAN_GAN, DI_ZHI, getShiShen, getWuXing } from '@/lib/bazi'

const FORTUNE_COLOR: Record<string, { bg: string; text: string }> = {
  '大吉': { bg: 'bg-green-500/15', text: 'text-green-400' },
  '吉': { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  '平': { bg: 'bg-slate-500/15', text: 'text-slate-400' },
  '凶': { bg: 'bg-orange-500/15', text: 'text-orange-400' },
  '大凶': { bg: 'bg-red-500/15', text: 'text-red-400' },
}

const WUXING_COLOR: Record<string, string> = {
  '木': '#4ade80', '火': '#f87171', '土': '#fbbf24', '金': '#e2e8f0', '水': '#60a5fa',
}

const MONTH_NAMES = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月']
const MONTH_ZHI = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑']

function getMonthGan(yearGan: string, monthIdx: number): string {
  const yearGanIdx = TIAN_GAN.indexOf(yearGan)
  const startGanIdx = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8][yearGanIdx]
  const ganIdx = (startGanIdx + monthIdx) % 10
  return TIAN_GAN[ganIdx]
}

function evaluateMonth(dayMaster: string, monthGan: string, monthZhi: string): { score: number; fortuneLevel: string; desc: string } {
  let score = 50
  const dayMasterWX = getWuXing(dayMaster)
  const monthGanWX = getWuXing(monthGan)

  // 生我者加分
  if (
    (dayMasterWX === '木' && monthGanWX === '水') ||
    (dayMasterWX === '火' && monthGanWX === '木') ||
    (dayMasterWX === '土' && monthGanWX === '火') ||
    (dayMasterWX === '金' && monthGanWX === '土') ||
    (dayMasterWX === '水' && monthGanWX === '金')
  ) {
    score += 8
  }
  // 同我者微加
  else if (monthGanWX === dayMasterWX) {
    score += 2
  }
  // 克我者减分
  else if (
    (dayMasterWX === '木' && monthGanWX === '金') ||
    (dayMasterWX === '火' && monthGanWX === '水') ||
    (dayMasterWX === '土' && monthGanWX === '木') ||
    (dayMasterWX === '金' && monthGanWX === '火') ||
    (dayMasterWX === '水' && monthGanWX === '土')
  ) {
    score -= 5
  }
  // 我克者微减
  else {
    score -= 2
  }

  // 十神加权
  const shiShen = getShiShen(dayMaster, monthGan)
  const bonus: Record<string, number> = {
    '正印': 5, '偏印': 3, '正官': 4, '正财': 3, '食神': 3,
    '比肩': 0, '劫财': -2, '伤官': -4, '偏财': 0, '七杀': -6,
  }
  score += bonus[shiShen] || 0

  score = Math.min(95, Math.max(15, score))

  let fortuneLevel: string
  if (score >= 80) fortuneLevel = '大吉'
  else if (score >= 65) fortuneLevel = '吉'
  else if (score >= 45) fortuneLevel = '平'
  else if (score >= 30) fortuneLevel = '凶'
  else fortuneLevel = '大凶'

  let desc = ''
  if (shiShen === '正印') desc = '贵人相助，适合学习深造'
  else if (shiShen === '偏印') desc = '灵感涌现，创意迸发'
  else if (shiShen === '正官') desc = '事业顺遂，适合争取晋升'
  else if (shiShen === '七杀') desc = '压力较大，需谨慎行事'
  else if (shiShen === '正财') desc = '财运稳定，适合理财规划'
  else if (shiShen === '偏财') desc = '意外之喜，但不可贪心'
  else if (shiShen === '食神') desc = '才华展现，适合创作输出'
  else if (shiShen === '伤官') desc = '思维活跃，注意言行分寸'
  else if (shiShen === '比肩') desc = '合作共赢，适合团队协作'
  else if (shiShen === '劫财') desc = '竞争激烈，守住基本盘'
  else desc = '运势平稳，顺其自然'

  return { score, fortuneLevel, desc }
}

export default function LiuyueTab({ dayMaster }: { dayMaster?: string }) {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1 // 1-12
  
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const yearGan = useMemo(() => {
    const ganIdx = (selectedYear - 4) % 10
    return TIAN_GAN[ganIdx]
  }, [selectedYear])

  const months = useMemo(() => {
    if (!dayMaster) return []
    return MONTH_ZHI.map((zhi, idx) => {
      const gan = getMonthGan(yearGan, idx)
      const eval_ = evaluateMonth(dayMaster, gan, zhi)
      return {
        name: MONTH_NAMES[idx],
        gan,
        zhi,
        ganZhi: gan + zhi,
        ...eval_,
        isCurrent: selectedYear === currentYear && idx + 1 === currentMonth,
      }
    })
  }, [dayMaster, yearGan, selectedYear, currentYear, currentMonth])

  return (
    <div className="space-y-4">
      {/* 年份切换 */}
      <div className="moonly-card p-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedYear(y => y - 1)}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <span className="text-white font-semibold text-lg">{selectedYear}年</span>
          <button 
            onClick={() => setSelectedYear(y => y + 1)}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
        {selectedYear === currentYear && (
          <p className="text-moonly-text-muted text-xs text-center mt-1">当前年份</p>
        )}
      </div>

      {/* 月份列表 */}
      <div className="moonly-card p-4">
        <h3 className="text-gold text-sm font-semibold mb-3">流月运势</h3>
        <div className="grid grid-cols-2 gap-2">
          {months.map((m) => {
            const colors = FORTUNE_COLOR[m.fortuneLevel] || FORTUNE_COLOR['平']
            return (
              <div 
                key={m.name}
                className={`p-3 rounded-xl transition ${
                  m.isCurrent 
                    ? 'bg-moonly-gold/10 border border-moonly-gold/30' 
                    : 'bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white/60 text-xs">{m.name}</span>
                  {m.isCurrent && <span className="text-[10px] bg-moonly-gold/20 text-gold px-1 py-0.5 rounded">本月</span>}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold" style={{ color: WUXING_COLOR[getWuXing(m.gan)] || '#fff' }}>{m.gan}</span>
                  <span className="text-lg text-white/70">{m.zhi}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${colors.text}`}>{m.score} · {m.fortuneLevel}</span>
                </div>
                <p className="text-white/40 text-xs mt-1 leading-relaxed">{m.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
