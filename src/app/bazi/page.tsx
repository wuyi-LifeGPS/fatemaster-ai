'use client'

import { useState } from 'react'
import Link from 'next/link'
import { analyzeBazi, getAiAnalysis } from '@/lib/analysis'

interface BaziResult {
  pillars: { name: string; gan: string; zhi: string }[]
  dayMaster: string
  wuXingCount: Record<string, number>
  wuXingFullCount: Record<string, number>
  tenGods: Record<string, string>
  yinYang: string
  wuXing: string
  aiAnalysis: string
  cangGanDetail?: { name: string; zhi: string; cangGan: { gan: string; qi: string; wuXing: string; shiShen: string }[] }[]
  bodyStrength?: any
  pattern?: any
  tiaoHou?: any
  _pendingAi?: boolean
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
      // 从设置中读取 API Key（如果有）
      const settings = localStorage.getItem('lifegps_settings')
      const apiKey = settings ? JSON.parse(settings).kimiApiKey : undefined

      // 前端直接计算八字 + 生成基础分析
      const result = analyzeBazi(
        formData.birthDate,
        formData.birthTime,
        formData.name,
        formData.gender,
        formData.note,
        apiKey
      )

      setResult(result)

      // 如果有 API Key，异步获取 AI 深度分析
      if (result._pendingAi && apiKey) {
        const aiAnalysis = await getAiAnalysis(
          {
            pillars: result.pillars,
            dayMaster: result.dayMaster,
            wuXingCount: result.wuXingCount,
            yinYang: result.yinYang,
            wuXing: result.wuXing,
          },
          formData.name,
          formData.gender,
          'bazi',
          formData.note,
          apiKey
        )

        if (aiAnalysis) {
          setResult((prev) => prev ? { ...prev, aiAnalysis } : null)
        }
      }
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

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">备注（可选）</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400"
                  placeholder="如有特殊需求或想了解的具体问题，可在此填写"
                  rows={3}
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

            {/* 地支藏干明细 */}
            {result.cangGanDetail && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4 font-serif">地支藏干</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {result.cangGanDetail.map((cg) => (
                    <div key={cg.name} className="border border-fate-100 rounded-lg p-4">
                      <div className="text-sm text-ink-500 mb-2 text-center">{cg.name} {cg.zhi}</div>
                      <div className="space-y-1">
                        {cg.cangGan.map((item, idx) => (
                          <div key={idx} className={`text-sm px-2 py-1 rounded ${
                            idx === 0 ? 'bg-fate-100 text-fate-800' : 'text-ink-500'
                          }`}>
                            {item.gan} <span className="text-xs">{item.qi}·{item.shiShen}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ink-400 mt-3">本气（主气）为地支最主要能量，中气、余气为辅助能量</p>
              </div>
            )}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4 font-serif">日主与格局</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-fate-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-ink-500">日主天干</div>
                  <div className="text-2xl font-bold text-fate-700">{result.dayMaster}</div>
                  <div className="text-xs text-ink-400">{result.yinYang}·{result.wuXing}</div>
                </div>
                <div className="bg-fate-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-ink-500">日主强弱</div>
                  <div className="text-2xl font-bold text-fate-700">{result.bodyStrength?.strength || '-'}</div>
                  <div className="text-xs text-ink-400">评分 {result.bodyStrength?.score || '-'}/10</div>
                </div>
                <div className="bg-fate-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-ink-500">格局</div>
                  <div className="text-lg font-bold text-fate-700 leading-tight">{result.pattern?.patternName || '-'}</div>
                  <div className="text-xs text-ink-400">{result.pattern?.patternType || ''}</div>
                </div>
                <div className="bg-fate-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-ink-500">喜用神</div>
                  <div className="text-sm font-bold text-fate-700 leading-tight mt-1">
                    {result.tiaoHou?.tiaoHouGod?.slice(0,2).map((g:string) => {
                      const wxMap:Record<string,string> = {'甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'};
                      const ssMap:Record<string,string> = result.tenGods || {};
                      return <div key={g} className="text-xs">{g}（{wxMap[g]}·{ssMap[g] || '调候'}）</div>;
                    })}
                    {result.bodyStrength?.strength === '偏弱' && (
                      <div className="text-xs text-ink-400 mt-1">辅：金（比劫助身）</div>
                    )}
                  </div>
                </div>
                <div className="bg-fate-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-ink-500">忌神</div>
                  <div className="text-sm font-bold text-fate-700 leading-tight mt-1">
                    {result.tiaoHou?.tiaoHouStatus !== 'adequate' && (
                      <div className="text-xs">
                        {result.tiaoHou?.tiaoHouGod?.some((g:string) => ['丙','丁'].includes(g)) ? '水（克火泄金）' : ''}
                        {result.tiaoHou?.tiaoHouGod?.some((g:string) => ['甲','乙'].includes(g)) ? '金过旺（克木）' : ''}
                      </div>
                    )}
                    <div className="text-xs text-ink-400 mt-1">土过旺（埋金）</div>
                  </div>
                </div>
              </div>
              {result.bodyStrength?.description && (
                <p className="mt-4 text-sm text-ink-600 bg-fate-50/50 p-3 rounded-lg">{result.bodyStrength.description}</p>
              )}
            </div>

            {/* 调候用神 */}
            {result.tiaoHou && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4 font-serif">调候用神</h3>
                <div className="bg-fate-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="text-center">
                      <div className="text-xs text-ink-500">月令气候</div>
                      <div className="text-lg font-bold text-fate-700">{result.tiaoHou.climate}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-ink-500">所需调候</div>
                      <div className="text-lg font-bold text-fate-700">
                        {result.tiaoHou.tiaoHouGod?.map((g: string) => {
                          const wxMap: Record<string, string> = {'甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'};
                          return <span key={g} className="mx-1">{g}({wxMap[g]})</span>;
                        })}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-ink-500">透出情况</div>
                      <div className="text-lg font-bold text-fate-700">
                        {result.tiaoHou.presentTiaoHou.length > 0 ? result.tiaoHou.presentTiaoHou.join('、') : '无'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-ink-500">调候状态</div>
                      <div className={`text-lg font-bold ${result.tiaoHou.tiaoHouStatus === 'adequate' ? 'text-green-600' : result.tiaoHou.tiaoHouStatus === 'buried' ? 'text-amber-600' : 'text-red-600'}`}>
                        {result.tiaoHou.tiaoHouStatus === 'adequate' ? '调和' : result.tiaoHou.tiaoHouStatus === 'buried' ? '暗藏' : '缺失'}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-ink-600">{result.tiaoHou.tiaoHouReason}</p>
                  <p className="text-sm text-ink-500 mt-2">{result.tiaoHou.tiaoHouDesc}</p>
                </div>
              </div>
            )}
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
