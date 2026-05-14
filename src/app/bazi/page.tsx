'use client'

import { useState } from 'react'
import Link from 'next/link'

interface BaziResult {
  pillars: { name: string; gan: string; zhi: string }[]
  dayMaster: string
  wuXingCount: Record<string, number>
  tenGods: Record<string, string>
  yinYang: string
  wuXing: string
  aiAnalysis: string
}

export default function BaziPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BaziResult | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
    birthDate: '',
    birthTime: '12:00',
    birthPlace: '',
    note: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          analysisType: 'bazi',
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      alert('分析出错，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-fate-50">
      {/* Header */}
      <header className="bg-ink-900 text-fate-50 py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif">
            ← AI 命理大师
          </Link>
          <h1 className="text-lg font-serif">八字分析</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {!result ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-serif mb-2">命盘解析</h2>
              <p className="text-ink-500">AI 智能八字分析系统，揭示个人命盘特质与发展规律</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 max-w-lg mx-auto">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">姓名（可选）</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400"
                  placeholder="请输入姓名"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">性别 *</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                      className="mr-2"
                    />
                    男
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                      className="mr-2"
                    />
                    女
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">出生日期 *</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">出生时间 *</label>
                <input
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                  className="w-full px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400"
                  required
                />
                <p className="text-xs text-ink-400 mt-1">如果不确定，默认使用中午 12:00</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">出生地点（可选）</label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  className="w-full px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400"
                  placeholder="如：北京"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-fate-600 hover:bg-fate-500 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? '正在分析...' : '开始八字分析'}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-serif">分析结果</h2>
              <button
                onClick={() => setResult(null)}
                className="text-fate-600 hover:text-fate-700"
              >
                ← 重新分析
              </button>
            </div>

            {/* 四柱 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4 font-serif">八字命盘</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                {result.pillars.map((pillar) => (
                  <div key={pillar.name} className="border border-fate-100 rounded-lg p-4">
                    <div className="text-sm text-ink-500 mb-2">{pillar.name}</div>
                    <div className="text-2xl font-bold text-fate-700">{pillar.gan}{pillar.zhi}</div>
                    <div className="text-xs text-ink-400 mt-1">
                      {result.tenGods[pillar.gan] && `天干: ${result.tenGods[pillar.gan]}`}
                      {result.tenGods[pillar.zhi] && ` · 地支: ${result.tenGods[pillar.zhi]}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 日主信息 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4 font-serif">日主特质</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-fate-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-ink-500">日主天干</div>
                  <div className="text-2xl font-bold text-fate-700">{result.dayMaster}</div>
                </div>
                <div className="bg-fate-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-ink-500">阴阳属性</div>
                  <div className="text-2xl font-bold text-fate-700">{result.yinYang}</div>
                </div>
                <div className="bg-fate-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-ink-500">五行属性</div>
                  <div className="text-2xl font-bold text-fate-700">{result.wuXing}</div>
                </div>
              </div>
            </div>

            {/* 五行分布 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4 font-serif">五行分布</h3>
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(result.wuXingCount).map(([element, count]) => (
                  <div key={element} className="text-center">
                    <div className="text-lg font-bold text-fate-700">{element}</div>
                    <div className="text-3xl font-bold text-fate-600 my-2">{count}</div>
                    <div className="w-full bg-fate-100 rounded-full h-2">
                      <div
                        className="bg-fate-500 h-2 rounded-full"
                        style={{ width: `${(count / 8) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI 分析 */}
            {result.aiAnalysis && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4 font-serif">AI 深度解析</h3>
                <div className="prose max-w-none text-ink-700 whitespace-pre-line">
                  {result.aiAnalysis}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
