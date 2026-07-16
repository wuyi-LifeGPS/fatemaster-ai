'use client'

import { useState, useEffect } from 'react'
import { hapticLight } from '@/lib/haptic'

const TIPS = [
  { category: '五行', content: '金生水，水生木，木生火，火生土，土生金——五行相生，循环不息。' },
  { category: '十神', content: '正印代表母亲、学业、贵人，命局中正印得力者，往往聪明有涵养。' },
  { category: '大运', content: '大运十年一变，每步大运的干支都会影响这十年的整体运势走向。' },
  { category: '日主', content: '日主即出生日的天干，代表你自己，是整个八字命盘的核心。' },
  { category: '喜用神', content: '喜用神是对命局最有利的五行，生活中多接触喜用神属性的事物有助于运势。' },
  { category: '身强身弱', content: '身强能担财官，身弱需印比帮身。判断身强身弱主要看月令、根气和天干。' },
  { category: '格局', content: '月令本气透干即为格局，如甲木生于寅月，寅中藏甲木，即为建禄格。' },
  { category: '流年', content: '流年即当年的天干地支，与命局产生作用，影响当年的运势吉凶。' },
  { category: '合婚', content: '八字合婚主要看双方日柱是否相合、五行是否互补，而非单纯看属相。' },
  { category: '纳音', content: '纳音五行是另一种五行分类法，如甲子乙丑为「海中金」，共有六十种纳音。' },
  { category: '地支藏干', content: '每个地支中都藏有一至三个天干，如寅中藏甲丙戊，称为本气、中气、余气。' },
  { category: '天干地支', content: '十天干配十二地支，组成六十甲子，是中华文化独特的时间记录体系。' },
  { category: '时辰', content: '一天分为十二个时辰，每个时辰对应一个地支，如子时为23:00-01:00。' },
  { category: '节气', content: '八字中的月份以节气为界，如立春才是寅月的开始，而非农历正月初一。' },
  { category: '冲合', content: '地支六冲：子午冲、丑未冲、寅申冲、卯酉冲、辰戌冲、巳亥冲。' },
]

function getDailyTip(): typeof TIPS[0] {
  const today = new Date().toDateString()
  const stored = localStorage.getItem('lifegps_daily_tip_date')
  const storedTip = localStorage.getItem('lifegps_daily_tip')

  if (stored === today && storedTip) {
    return JSON.parse(storedTip)
  }

  const index = Math.floor(Math.random() * TIPS.length)
  const tip = TIPS[index]
  localStorage.setItem('lifegps_daily_tip_date', today)
  localStorage.setItem('lifegps_daily_tip', JSON.stringify(tip))
  return tip
}

export default function DailyTip() {
  const [tip, setTip] = useState<typeof TIPS[0] | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    setTip(getDailyTip())
  }, [])

  if (!tip || collapsed) return null

  return (
    <div className="mx-4 mb-4 moonly-card p-3 border border-gold/20 animate-fade-in">
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">💡</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gold bg-gold/10 px-2 py-0.5 rounded-full">{tip.category}</span>
            <span className="text-xs text-moonly-muted">今日小贴士</span>
          </div>
          <p className="text-sm text-moonly-secondary leading-relaxed">{tip.content}</p>
        </div>
        <button
          onClick={() => {
            hapticLight()
            setCollapsed(true)
          }}
          className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-moonly-muted hover:text-white transition flex-shrink-0"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
