'use client'

import { useState } from 'react'
import Link from 'next/link'

const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const WUXING = ['木', '火', '土', '金', '水']

function getGanZhi(year: number, month: number, day: number) {
  // Simplified calculation for demo
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

export default function BirthChartPage() {
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState<'男' | '女'>('男')
  const [result, setResult] = useState<{
    year: string
    month: string
    day: string
    wuxing: string
    analysis: string
  } | null>(null)

  const analyze = () => {
    if (!birthDate) return
    const date = new Date(birthDate)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const ganZhi = getGanZhi(year, month, day)
    const wuxing = getWuxing(ganZhi.year)
    const analysis = `你的八字为${ganZhi.year}年 ${ganZhi.month}月 ${ganZhi.day}日。日主属${wuxing}，性格${wuxing === '木' ? '仁慈正直' : wuxing === '火' ? '热情礼貌' : wuxing === '土' ? '诚实可靠' : wuxing === '金' ? '果断正义' : '聪明灵活'}。`
    setResult({ ...ganZhi, wuxing, analysis })
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
          <h1 className="text-gold-gradient text-xl font-bold">生辰八字</h1>
          <p className="text-moonly-muted text-xs">八字排盘，详细分析</p>
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
          <label className="text-white text-sm font-medium mb-2 block">性别</label>
          <div className="flex gap-3">
            <button
              onClick={() => setGender('男')}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                gender === '男'
                  ? 'bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/30'
                  : 'bg-white/5 text-white border border-white/10'
              }`}
            >
              男
            </button>
            <button
              onClick={() => setGender('女')}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                gender === '女'
                  ? 'bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/30'
                  : 'bg-white/5 text-white border border-white/10'
              }`}
            >
              女
            </button>
          </div>
        </div>
        <button
          onClick={analyze}
          disabled={!birthDate}
          className="w-full py-3 bg-[#c9a96e]/10 text-[#c9a96e] rounded-xl font-medium hover:bg-[#c9a96e]/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          排盘分析
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-4xl mb-3">☯️</div>
            <div className="text-gold text-2xl font-bold mb-2">八字排盘</div>
            <div className="text-moonly-secondary text-sm leading-relaxed">
              {result.year}年 {result.month}月 {result.day}日
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="moonly-card p-4 text-center">
              <div className="text-moonly-muted text-xs mb-1">年柱</div>
              <div className="text-gold text-xl font-bold">{result.year}</div>
            </div>
            <div className="moonly-card p-4 text-center">
              <div className="text-moonly-muted text-xs mb-1">月柱</div>
              <div className="text-gold text-xl font-bold">{result.month}</div>
            </div>
            <div className="moonly-card p-4 text-center">
              <div className="text-moonly-muted text-xs mb-1">日柱</div>
              <div className="text-gold text-xl font-bold">{result.day}</div>
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">五行分析</h3>
            <div className="text-moonly-secondary text-sm leading-relaxed">
              日主属{result.wuxing}，五行{result.wuxing}主{result.wuxing === '木' ? '仁' : result.wuxing === '火' ? '礼' : result.wuxing === '土' ? '信' : result.wuxing === '金' ? '义' : '智'}。
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">性格分析</h3>
            <div className="text-moonly-secondary text-sm leading-relaxed">
              {result.analysis}
            </div>
          </div>

          <button
            onClick={() => { setBirthDate(''); setResult(null) }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新排盘
          </button>
        </div>
      )}
    </div>
  )
}
