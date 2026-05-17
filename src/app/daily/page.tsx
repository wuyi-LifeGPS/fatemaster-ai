'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { calculateBazi, getTodayGanZhi } from '@/lib/bazi'
import { analyzeDailyFortune } from '@/lib/analysis'

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
  const [formData, setFormData] = useState({
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
    gender: 'male' as 'male' | 'female',
    name: '',
  })

  // 客户端获取今天干支
  useEffect(() => {
    const tg = getTodayGanZhi()
    setTodayGanZhi(tg)
  }, [])

  const yearOptions = Array.from({ length: 131 }, (_, i) => 1900 + i)
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)
  const hourOptions = Array.from({ length: 24 }, (_, i) => i)
  const pad = (n: number) => String(n).padStart(2, '0')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!todayGanZhi) return
    setLoading(true)

    try {
      const birthDate = `${formData.birthYear}-${pad(formData.birthMonth)}-${pad(formData.birthDay)}`
      const birthTime = `${pad(formData.birthHour)}:00`

      // 排命主八字
      const bazi = calculateBazi(birthDate, birthTime)

      // 计算日运
      const fortune = analyzeDailyFortune(todayGanZhi, bazi)
      setResult(fortune)
    } catch (error) {
      console.error('Error:', error)
      alert('分析出错，请重试')
    } finally {
      setLoading(false)
    }
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
          <span key={i} className={`text-lg ${i < count ? 'text-amber-400' : 'text-ink-200'}`}>
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-fate-50">
      {/* Header */}
      <header className="bg-ink-900 text-fate-50 py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif">
            ← AI 命理大师
          </Link>
          <h1 className="text-lg font-serif">每日运势</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* 今天日期 */}
        {todayGanZhi && (
          <div className="bg-gradient-to-br from-ink-800 to-ink-900 text-white rounded-xl p-6 mb-6 text-center">
            <div className="text-sm text-fate-300 mb-2">
              {todayGanZhi.dateStr} · 星期{todayGanZhi.weekday}
            </div>
            <div className="text-3xl font-bold font-serif mb-1">
              {todayGanZhi.year.gan}{todayGanZhi.year.zhi}年
              {todayGanZhi.month.gan}{todayGanZhi.month.zhi}月
              {todayGanZhi.day.gan}{todayGanZhi.day.zhi}日
            </div>
            <div className="text-sm text-fate-400">
              今日日柱：{todayGanZhi.day.gan}{todayGanZhi.day.zhi}
            </div>
          </div>
        )}

        {/* 输入表单 */}
        {!result && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 font-serif">输入生日，查看今日运势</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">出生日期</label>
                <div className="flex gap-2">
                  <select
                    value={formData.birthYear}
                    onChange={(e) => setFormData({ ...formData, birthYear: Number(e.target.value) })}
                    className="flex-1 px-3 py-2 border border-fate-200 rounded-md bg-white"
                  >
                    {yearOptions.map(y => <option key={y} value={y}>{y}年</option>)}
                  </select>
                  <select
                    value={formData.birthMonth}
                    onChange={(e) => setFormData({ ...formData, birthMonth: Number(e.target.value) })}
                    className="w-20 px-3 py-2 border border-fate-200 rounded-md bg-white"
                  >
                    {monthOptions.map(m => <option key={m} value={m}>{m}月</option>)}
                  </select>
                  <select
                    value={formData.birthDay}
                    onChange={(e) => setFormData({ ...formData, birthDay: Number(e.target.value) })}
                    className="w-20 px-3 py-2 border border-fate-200 rounded-md bg-white"
                  >
                    {dayOptions.map(d => <option key={d} value={d}>{d}日</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">出生时辰（选填）</label>
                <select
                  value={formData.birthHour}
                  onChange={(e) => setFormData({ ...formData, birthHour: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-fate-200 rounded-md bg-white"
                >
                  {hourOptions.map(h => (
                    <option key={h} value={h}>
                      {pad(h)}:00 ({getHourZhiName(h)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">性别（选填）</label>
                <div className="flex gap-3">
                  {[
                    { key: 'male', label: '男' },
                    { key: 'female', label: '女' },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: opt.key as 'male' | 'female' })}
                      className={`flex-1 py-2 rounded-lg border transition-colors ${
                        formData.gender === opt.key
                          ? 'border-fate-600 bg-fate-50 text-fate-800'
                          : 'border-fate-200 hover:border-fate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !todayGanZhi}
                className="w-full bg-fate-600 hover:bg-fate-500 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? '分析中...' : '查看今日运势'}
              </button>
            </form>
          </div>
        )}

        {/* 结果展示 */}
        {result && (
          <div className="space-y-4">
            {/* 重新输入按钮 */}
            <button
              onClick={() => setResult(null)}
              className="text-fate-600 text-sm hover:underline"
            >
              ← 重新输入
            </button>

            {/* 综合评分 */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
              <div className="text-center">
                <div className="text-sm text-ink-500 mb-2">综合运势</div>
                <div className="text-5xl font-bold text-amber-700 mb-2">{result.scores.overall}</div>
                {renderStars(result.scores.overall)}
                <div className="text-lg font-medium text-ink-700 mt-3">{result.summary}</div>
              </div>
            </div>

            {/* 四项评分 */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'career', label: '事业', icon: '💼' },
                { key: 'wealth', label: '财运', icon: '💰' },
                { key: 'love', label: '感情', icon: '❤️' },
                { key: 'health', label: '健康', icon: '🏃' },
              ].map((item) => (
                <div key={item.key} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{item.icon}</span>
                    <span className="text-sm text-ink-500">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-ink-800">
                      {(result.scores as any)[item.key]}
                    </span>
                    {renderStars((result.scores as any)[item.key])}
                  </div>
                </div>
              ))}
            </div>

            {/* 运势描述 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-3 font-serif">今日运势解读</h3>
              <p className="text-ink-600 leading-relaxed">{result.description}</p>
              <div className="mt-4 text-sm text-ink-400">
                今日日干十神：<span className="text-fate-700 font-medium">{result.dayShiShen.gan}</span>
                {' · '}
                日支本气：<span className="text-fate-700 font-medium">{result.dayShiShen.zhiBenQi}</span>
              </div>
            </div>

            {/* 宜忌 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">✅</span>
                  <span className="font-bold text-green-800">宜</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.suitable.map((item, i) => (
                    <span key={i} className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">❌</span>
                  <span className="font-bold text-red-800">忌</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.unsuitable.map((item, i) => (
                    <span key={i} className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 吉时/凶时 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 font-serif">时辰吉凶</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-green-600 font-medium mb-2">🍀 吉时</div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.luckyHours.length > 0 ? result.luckyHours.map((h, i) => (
                      <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                        {h}
                      </span>
                    )) : <span className="text-xs text-ink-400">今日无特别吉时</span>}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-red-600 font-medium mb-2">⚠️ 凶时</div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.unluckyHours.length > 0 ? result.unluckyHours.map((h, i) => (
                      <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                        {h}
                      </span>
                    )) : <span className="text-xs text-ink-400">今日无特别凶时</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* 开运建议 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <h3 className="font-bold text-lg mb-4 font-serif">开运指南</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                    🎨
                  </div>
                  <div>
                    <div className="text-sm text-ink-500">开运颜色</div>
                    <div className="font-medium text-ink-700">{result.luckyColor}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                    🧭
                  </div>
                  <div>
                    <div className="text-sm text-ink-500">开运方位</div>
                    <div className="font-medium text-ink-700">{result.luckyDirection}</div>
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
