'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { calculateBazi, getTodayGanZhi } from '@/lib/bazi'
import { analyzeDailyFortune } from '@/lib/analysis'
import { addHistory, getHistoryByType, formatHistoryTime, type HistoryRecord } from '@/lib/history'
import { lunarToSolar } from '@/lib/lunar'
import PersonFormSelector from '@/components/PersonFormSelector'

interface FortuneResult {
  today: {
    year: { gan: string; zhi: string }
    month: { gan: string; zhi: string }
    day: { gan: string; zhi: string }
    dateStr: string
    weekday: string
  }
  dayShiShen: {
    gan: string
    zhiBenQi: string
    monthGan: string
    yearGan: string
  }
  scores: {
    overall: number
    career: number
    wealth: number
    love: number
    health: number
  }
  summary: string
  description: string
  suitable: string[]
  unsuitable: string[]
  luckyHours: string[]
  unluckyHours: string[]
  luckyColor: string
  luckyDirection: string
}

export default function DailyPage() {
  const [loading, setLoading] = useState(false)
  const [todayGanZhi, setTodayGanZhi] = useState<any>(null)
  const [result, setResult] = useState<FortuneResult | null>(null)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [formData, setFormData] = useState({
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
    birthMinute: 0,
    gender: 'male' as 'male' | 'female',
    name: '',
    calendarType: 'solar' as 'solar' | 'lunar',
    lunarIsLeap: false,
  })

  // 客户端获取今天干支
  useEffect(() => {
    const tg = getTodayGanZhi()
    setTodayGanZhi(tg)
  }, [])

  // 加载历史记录
  useEffect(() => {
    setHistory(getHistoryByType('daily'))
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!todayGanZhi) return
    setLoading(true)

    try {
      // 农历转公历（如需要）
      let solarYear = formData.birthYear
      let solarMonth = formData.birthMonth
      let solarDay = formData.birthDay
      if (formData.calendarType === 'lunar') {
        const solar = lunarToSolar(formData.birthYear, formData.birthMonth, formData.birthDay, formData.lunarIsLeap)
        if (!solar) {
          alert('农历日期转换失败，请检查日期是否有效（如闰月是否存在）')
          setLoading(false)
          return
        }
        solarYear = solar.year
        solarMonth = solar.month
        solarDay = solar.day
      }

      const birthDate = `${solarYear}-${pad(solarMonth)}-${pad(solarDay)}`
      const birthTime = `${pad(formData.birthHour)}:${pad(formData.birthMinute)}`

      // 排命主八字
      const bazi = calculateBazi(birthDate, birthTime)

      // 计算日运
      const fortune = analyzeDailyFortune(todayGanZhi, bazi)
      setResult(fortune)

      // 保存记录
      const title = `${formData.name || '未命名'} · ${todayGanZhi.dateStr} 日运`
      addHistory('daily', title, formData, `${fortune.scores.overall}分 · ${fortune.summary}`)
      setHistory(getHistoryByType('daily'))
    } catch (error) {
      console.error('Error:', error)
      alert('分析出错，请重试')
    } finally {
      setLoading(false)
    }
  }

  const loadHistory = (record: HistoryRecord) => {
    setFormData({
      ...record.formData,
      calendarType: record.formData.calendarType || 'solar',
      lunarIsLeap: record.formData.lunarIsLeap || false,
      birthMinute: record.formData.birthMinute || 0,
    })
    setShowHistory(false)
  }

  const getStarCount = (score: number) => {
    if (score >= 80) return 5
    if (score >= 65) return 4
    if (score >= 50) return 3
    if (score >= 35) return 2
    return 1
  }

  const renderStars = (score: number) => {
    const count = getStarCount(score)
    return (
      <div className="flex gap-0.5 justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`text-lg ${i < count ? 'text-gold' : 'text-moonly-text-muted'}`}>
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <main className="min-h-screen moonly-bg moonly-content animate-fade-in">
      {/* Header */}
      <header className="bg-transparent py-4 px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-gold-gradient text-xl font-bold">每日运势</h1>
        </div>
      </header>

      <div className="py-4 px-4">
        {/* 今天日期 */}
        {todayGanZhi && (
          <div className="bg-white/5 border border-white/10 text-white rounded-xl p-6 mb-6 text-center">
            <div className="text-sm text-moonly-text-muted mb-2">
              {todayGanZhi.dateStr} · 星期{todayGanZhi.weekday}
            </div>
            <div className="text-3xl font-bold font-serif mb-1">
              {todayGanZhi.year.gan}{todayGanZhi.year.zhi}年
              {todayGanZhi.month.gan}{todayGanZhi.month.zhi}月
              {todayGanZhi.day.gan}{todayGanZhi.day.zhi}日
            </div>
            <div className="text-sm text-gold">
              今日日柱：{todayGanZhi.day.gan}{todayGanZhi.day.zhi}
            </div>
          </div>
        )}

        {/* 输入表单 */}
        {!result && (
          <div className="moonly-card p-6">
            <h2 className="text-xl font-bold mb-6 font-serif">输入生日，查看今日运势</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <PersonFormSelector form={formData} setForm={setFormData as any} showGender={true} />
              </div>

              <button
                type="submit"
                disabled={loading || !todayGanZhi}
                className="w-full btn-gold py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? '分析中...' : '查看今日运势'}
              </button>
            </form>

            {/* 历史记录 */}
            {history.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-sm text-moonly-text-muted hover:text-moonly-gold mb-3"
                >
                  <span>查询历史</span>
                  <span>查询历史（{history.length} 条）</span>
                  <span>{showHistory ? '▲' : '▼'}</span>
                </button>
                {showHistory && (
                  <div className="moonly-card border border-white/10 overflow-hidden">
                    {history.map((record) => (
                      <div
                        key={record.id}
                        onClick={() => loadHistory(record)}
                        className="px-4 py-3 border-b border-white/10 last:border-0 hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm text-white">{record.title}</div>
                            <div className="text-xs text-moonly-text-muted mt-0.5">{record.resultSummary}</div>
                          </div>
                          <div className="text-xs text-moonly-text-muted whitespace-nowrap ml-2">{formatHistoryTime(record.timestamp)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 结果展示 */}
        {result && (
          <div className="space-y-4">
            {/* 重新输入按钮 */}
            <button
              onClick={() => setResult(null)}
              className="text-gold text-sm hover:underline"
            >
              ← 重新输入
            </button>

            {/* 综合评分 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 border border-[#c9a96e]/20">
              <div className="text-center">
                <div className="text-sm text-moonly-text-muted mb-2">综合运势</div>
                <div className="text-5xl font-bold text-gold mb-2">{result.scores.overall}</div>
                {renderStars(result.scores.overall)}
                <div className="text-lg font-medium text-white mt-3">{result.summary}</div>
              </div>
            </div>

            {/* 四项评分 */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'career', label: '事业', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                { key: 'wealth', label: '财运', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                { key: 'love', label: '感情', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
                { key: 'health', label: '健康', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
              ].map((item) => (
                <div key={item.key} className="moonly-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{item.icon}</span>
                    <span className="text-sm text-moonly-text-muted">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">
                      {(result.scores as any)[item.key]}
                    </span>
                    {renderStars((result.scores as any)[item.key])}
                  </div>
                </div>
              ))}
            </div>

            {/* 运势描述 */}
            <div className="moonly-card p-6">
              <h3 className="font-bold text-lg mb-3 font-serif">今日运势解读</h3>
              <p className="text-moonly-text-secondary leading-relaxed">{result.description}</p>
              <div className="mt-4 text-sm text-moonly-text-muted">
                今日日干十神：<span className="text-gold font-medium">{result.dayShiShen.gan}</span>
                {' · '}
                日支本气：<span className="text-gold font-medium">{result.dayShiShen.zhiBenQi}</span>
              </div>
            </div>

            {/* 宜忌 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border-green-500/20 bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">宜</span>
                  <span className="font-bold text-green-300">宜</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.suitable.map((item, i) => (
                    <span key={i} className="text-sm bg-green-500/15 text-green-300 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-red-500/20 bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">忌</span>
                  <span className="font-bold text-red-300">忌</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.unsuitable.map((item, i) => (
                    <span key={i} className="text-sm bg-red-500/15 text-red-300 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 吉时/凶时 */}
            <div className="moonly-card p-6">
              <h3 className="font-bold text-lg mb-4 font-serif">时辰吉凶</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-green-300 font-medium mb-2">吉时</div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.luckyHours.length > 0 ? result.luckyHours.map((h, i) => (
                      <span key={i} className="text-xs border-green-500/20 bg-green-500/10 text-green-300 px-2 py-1 rounded">
                        {h}
                      </span>
                    )) : <span className="text-xs text-moonly-text-muted">今日无特别吉时</span>}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-red-300 font-medium mb-2">凶时</div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.unluckyHours.length > 0 ? result.unluckyHours.map((h, i) => (
                      <span key={i} className="text-xs border-red-500/20 bg-red-500/10 text-red-300 px-2 py-1 rounded">
                        {h}
                      </span>
                    )) : <span className="text-xs text-moonly-text-muted">今日无特别凶时</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* 开运建议 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 border border-purple-500/20">
              <h3 className="font-bold text-lg mb-4 font-serif">开运指南</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-xl shadow-sm">
                    色
                  </div>
                  <div>
                    <div className="text-sm text-moonly-text-muted">开运颜色</div>
                    <div className="font-medium text-white">{result.luckyColor}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-xl shadow-sm">
                    向
                  </div>
                  <div>
                    <div className="text-sm text-moonly-text-muted">开运方位</div>
                    <div className="font-medium text-white">{result.luckyDirection}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

// 时辰名称
function getHourZhiName(hour: number): string {
  const names = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  if (hour >= 23 || hour < 1) return names[0]
  return names[Math.floor((hour - 1) / 2) + 1]
}
