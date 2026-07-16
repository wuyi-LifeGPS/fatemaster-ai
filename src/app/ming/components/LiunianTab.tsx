'use client'

import { useState, useMemo } from 'react'
import { DaYunInfo, LiuNianInfo } from '@/lib/bazi'

const FORTUNE_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  '大吉': { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/30' },
  '吉': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  '平': { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30' },
  '凶': { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30' },
  '大凶': { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
}

const WUXING_COLOR: Record<string, string> = {
  '木': '#4ade80', '火': '#f87171', '土': '#fbbf24', '金': '#e2e8f0', '水': '#60a5fa',
}

export default function LiunianTab({ daYunList, dayMaster }: { daYunList: DaYunInfo[]; dayMaster?: string }) {
  const [expandedYear, setExpandedYear] = useState<number | null>(null)
  
  const allLiuNian = useMemo(() => {
    const list: (LiuNianInfo & { daYunGanZhi: string; daYunIndex: number })[] = []
    daYunList.forEach(dy => {
      dy.years.forEach(ln => {
        list.push({ ...ln, daYunGanZhi: dy.ganZhi, daYunIndex: dy.index })
      })
    })
    return list
  }, [daYunList])

  const currentYear = new Date().getFullYear()
  const currentLiuNian = allLiuNian.find(ln => ln.isCurrent)

  return (
    <div className="space-y-4">
      {/* 当年运势概览 */}
      {currentLiuNian && (
        <div className="moonly-card p-4">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-bold text-gold">{currentLiuNian.score}</span>
            <span className={`text-lg font-medium ${FORTUNE_COLOR[currentLiuNian.fortuneLevel]?.text || 'text-white'}`}>
              {currentLiuNian.fortuneLevel}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-white font-semibold text-lg">{currentLiuNian.ganZhi}年</span>
            <span className="text-moonly-muted text-sm">· {currentLiuNian.age}岁</span>
            <span className="text-moonly-muted text-sm">· 第{currentLiuNian.daYunIndex}步大运</span>
          </div>
          <div className="text-moonly-secondary text-sm">
            天干十神：<span style={{ color: WUXING_COLOR[currentLiuNian.wuXing] }}>{currentLiuNian.shiShen}</span>
          </div>
        </div>
      )}

      {/* 流年列表 */}
      <div className="moonly-card p-4">
        <h3 className="text-gold text-sm font-semibold mb-3">流年运势</h3>
        <div className="space-y-2">
          {allLiuNian.map((ln) => {
            const colors = FORTUNE_COLOR[ln.fortuneLevel] || FORTUNE_COLOR['平']
            const isExpanded = expandedYear === ln.year
            return (
              <div key={ln.year}>
                <button
                  onClick={() => setExpandedYear(isExpanded ? null : ln.year)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
                    ln.isCurrent 
                      ? 'bg-[#c9a96e]/10 border border-[#c9a96e]/30' 
                      : 'bg-white/5 hover:bg-white/8'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${colors.bg} ${colors.border} border`}>
                    <span className="text-lg font-bold" style={{ color: WUXING_COLOR[ln.wuXing] || '#fff' }}>{ln.gan}</span>
                    <span className="text-xs text-white/50">{ln.zhi}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{ln.year}年</span>
                      {ln.isCurrent && <span className="text-[10px] bg-[#c9a96e]/20 text-gold px-1.5 py-0.5 rounded">今年</span>}
                    </div>
                    <div className="text-white/40 text-xs">{ln.age}岁 · {ln.shiShen} · {ln.daYunGanZhi}运</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${colors.text}`}>{ln.score}</span>
                    <span className={`block text-xs ${colors.text}`}>{ln.fortuneLevel}</span>
                  </div>
                  <svg 
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"
                    className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                
                {/* 展开详情 */}
                {isExpanded && ln.monthHighlights && ln.monthHighlights.length > 0 && (
                  <div className="mt-2 ml-2 pl-4 border-l-2 border-white/10 space-y-2">
                    <div className="text-white/50 text-xs mb-1">关键月份</div>
                    {ln.monthHighlights.map((mh, i) => (
                      <div key={i} className={`text-sm py-1.5 px-3 rounded-lg ${
                        mh.level === '吉' ? 'bg-green-500/10 text-green-300' :
                        mh.level === '凶' ? 'bg-red-500/10 text-red-300' :
                        'bg-white/5 text-white/60'
                      }`}>
                        {mh.desc}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
