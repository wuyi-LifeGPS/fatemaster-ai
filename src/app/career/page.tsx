'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { analyzeCareer, analyzeBazi } from '@/lib/analysis'
import { addHistory, getHistoryByType, formatHistoryTime, type HistoryRecord } from '@/lib/history'

interface CareerResult {
  score: number
  level: string
  levelColor: string
  levelDesc: string
  ganHeMatch: boolean
  zhiHeMatch: boolean
  mToF_SS: string
  fToM_SS: string
  pairMatch: { m: string; f: string; desc: string } | undefined
  complementScore: number
  complementDetails: string[]
  mHelpF: number
  fHelpM: number
  roles: { mRole: string; fRole: string }
  suggestions: string[]
}

export default function CareerPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CareerResult | null>(null)
  const [mBazi, setMBazi] = useState<any>(null)
  const [fBazi, setFBazi] = useState<any>(null)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const [mForm, setMForm] = useState({
    name: '',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
  })

  const [fForm, setFForm] = useState({
    name: '',
    birthYear: 1992,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
  })

  const yearOptions = Array.from({ length: 131 }, (_, i) => 1900 + i)
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)
  const hourOptions = Array.from({ length: 24 }, (_, i) => i)
  const pad = (n: number) => String(n).padStart(2, '0')

  useEffect(() => {
    setHistory(getHistoryByType('career'))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const mDate = `${mForm.birthYear}-${pad(mForm.birthMonth)}-${pad(mForm.birthDay)}`
      const mTime = `${pad(mForm.birthHour)}:00`
      const fDate = `${fForm.birthYear}-${pad(fForm.birthMonth)}-${pad(fForm.birthDay)}`
      const fTime = `${pad(fForm.birthHour)}:00`

      const mBaziResult = analyzeBazi(mDate, mTime, mForm.name, 'male')
      const fBaziResult = analyzeBazi(fDate, fTime, fForm.name, 'female')

      const careerResult = analyzeCareer(mBaziResult, fBaziResult, mForm.name, fForm.name)

      setMBazi(mBaziResult)
      setFBazi(fBaziResult)
      setResult(careerResult)

      // 保存记录
      const title = `${mForm.name || '甲方'} & ${fForm.name || '乙方'} · 事业合作`
      addHistory('career', title, { mForm, fForm }, `${careerResult.score}分 · ${careerResult.level}`)
      setHistory(getHistoryByType('career'))
    } catch (error) {
      console.error('Error:', error)
      alert('分析出错，请重试')
    } finally {
      setLoading(false)
    }
  }

  const loadHistory = (record: HistoryRecord) => {
    setMForm(record.formData.mForm)
    setFForm(record.formData.fForm)
    setShowHistory(false)
  }

  return (
    <main className="min-h-screen bg-fate-50">
      {/* Header */}
      <header className="bg-ink-900 text-fate-50 py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif">
            ← AI 命理大师
          </Link>
          <h1 className="text-lg font-serif">事业合作分析</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* 说明 */}
        {!result && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-bold mb-2 font-serif">事业合作八字分析</h2>
            <p className="text-ink-600 text-sm">
              通过双方八字的五行互补、十神互动、喜用神互济等维度，评估商业合作契合度。
              适合合伙创业、项目合作、投资伙伴等场景。
            </p>
          </div>
        )}

        {/* 输入表单 */}
        {!result && (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* 甲方 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">甲</div>
                  <h3 className="font-bold text-lg">甲方信息</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-ink-500 mb-1">姓名（选填）</label>
                    <input
                      type="text"
                      value={mForm.name}
                      onChange={(e) => setMForm({ ...mForm, name: e.target.value })}
                      placeholder="姓名"
                      className="w-full px-3 py-2 border border-fate-200 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-ink-500 mb-1">出生日期 *</label>
                    <div className="flex gap-2">
                      <select value={mForm.birthYear} onChange={(e) => setMForm({ ...mForm, birthYear: Number(e.target.value) })} className="flex-1 px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                        {yearOptions.map(y => <option key={y} value={y}>{y}年</option>)}
                      </select>
                      <select value={mForm.birthMonth} onChange={(e) => setMForm({ ...mForm, birthMonth: Number(e.target.value) })} className="w-16 px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                        {monthOptions.map(m => <option key={m} value={m}>{m}月</option>)}
                      </select>
                      <select value={mForm.birthDay} onChange={(e) => setMForm({ ...mForm, birthDay: Number(e.target.value) })} className="w-16 px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                        {dayOptions.map(d => <option key={d} value={d}>{d}日</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-ink-500 mb-1">出生时辰</label>
                    <select value={mForm.birthHour} onChange={(e) => setMForm({ ...mForm, birthHour: Number(e.target.value) })} className="w-full px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                      {hourOptions.map(h => <option key={h} value={h}>{pad(h)}:00</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* 乙方 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">乙</div>
                  <h3 className="font-bold text-lg">乙方信息</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-ink-500 mb-1">姓名（选填）</label>
                    <input
                      type="text"
                      value={fForm.name}
                      onChange={(e) => setFForm({ ...fForm, name: e.target.value })}
                      placeholder="姓名"
                      className="w-full px-3 py-2 border border-fate-200 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-ink-500 mb-1">出生日期 *</label>
                    <div className="flex gap-2">
                      <select value={fForm.birthYear} onChange={(e) => setFForm({ ...fForm, birthYear: Number(e.target.value) })} className="flex-1 px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                        {yearOptions.map(y => <option key={y} value={y}>{y}年</option>)}
                      </select>
                      <select value={fForm.birthMonth} onChange={(e) => setFForm({ ...fForm, birthMonth: Number(e.target.value) })} className="w-16 px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                        {monthOptions.map(m => <option key={m} value={m}>{m}月</option>)}
                      </select>
                      <select value={fForm.birthDay} onChange={(e) => setFForm({ ...fForm, birthDay: Number(e.target.value) })} className="w-16 px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                        {dayOptions.map(d => <option key={d} value={d}>{d}日</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-ink-500 mb-1">出生时辰</label>
                    <select value={fForm.birthHour} onChange={(e) => setFForm({ ...fForm, birthHour: Number(e.target.value) })} className="w-full px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                      {hourOptions.map(h => <option key={h} value={h}>{pad(h)}:00</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-400 hover:to-emerald-400 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30"
            >
              {loading ? '分析中...' : '🤝 开始事业合作分析'}
            </button>
          </form>

          {/* 历史记录 */}
          {history.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 text-sm text-ink-500 hover:text-fate-600 mb-3"
              >
                <span>📜</span>
                <span>查询历史（{history.length} 条）</span>
                <span>{showHistory ? '▲' : '▼'}</span>
              </button>
              {showHistory && (
                <div className="bg-white rounded-lg shadow-sm border border-fate-100 overflow-hidden">
                  {history.map((record) => (
                    <div
                      key={record.id}
                      onClick={() => loadHistory(record)}
                      className="px-4 py-3 border-b border-fate-50 last:border-0 hover:bg-fate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm text-ink-800">{record.title}</div>
                          <div className="text-xs text-ink-400 mt-0.5">{record.resultSummary}</div>
                        </div>
                        <div className="text-xs text-ink-300 whitespace-nowrap ml-2">{formatHistoryTime(record.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          </>
        )}

        {/* 结果展示 */}
        {result && (
          <div className="space-y-6">
            <button onClick={() => setResult(null)} className="text-fate-600 text-sm hover:underline">
              ← 重新输入
            </button>

            {/* 综合评分 */}
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-8 border border-blue-100 text-center">
              <div className="text-sm text-ink-500 mb-2">合作契合度</div>
              <div className={`text-6xl font-bold mb-2 ${result.levelColor}`}>{result.score}</div>
              <div className="flex justify-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-2xl ${i < Math.round(result.score / 20) ? 'text-blue-400' : 'text-ink-200'}`}>★</span>
                ))}
              </div>
              <div className={`text-xl font-bold ${result.levelColor}`}>{result.level}</div>
              <p className="text-ink-600 mt-2 max-w-md mx-auto">{result.levelDesc}</p>
            </div>

            {/* 双方八字 */}
            <div className="grid md:grid-cols-2 gap-4">
              {mBazi && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">甲</div>
                    <span className="font-bold">{mForm.name || '甲方'}八字</span>
                  </div>
                  <div className="text-sm text-ink-700 space-y-1">
                    {mBazi.pillars.map((p: any) => (
                      <div key={p.name} className="flex justify-between">
                        <span className="text-ink-500">{p.name}</span>
                        <span className="font-medium">{p.gan}{p.zhi}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-blue-200 mt-2">
                      <span className="text-ink-500">日主：</span>
                      <span className="font-bold">{mBazi.dayMaster}（{mBazi.yinYang}·{mBazi.wuXing}）</span>
                    </div>
                  </div>
                </div>
              )}
              {fBazi && (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">乙</div>
                    <span className="font-bold">{fForm.name || '乙方'}八字</span>
                  </div>
                  <div className="text-sm text-ink-700 space-y-1">
                    {fBazi.pillars.map((p: any) => (
                      <div key={p.name} className="flex justify-between">
                        <span className="text-ink-500">{p.name}</span>
                        <span className="font-medium">{p.gan}{p.zhi}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-emerald-200 mt-2">
                      <span className="text-ink-500">日主：</span>
                      <span className="font-bold">{fBazi.dayMaster}（{fBazi.yinYang}·{fBazi.wuXing}）</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 合冲关系 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 font-serif">合作气场</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm ${result.ganHeMatch ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-ink-50 border-ink-200 text-ink-400'}`}>
                  {result.ganHeMatch ? '🤝' : '○'} 天干相合{result.ganHeMatch ? ' ✓' : ' ✗'}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm ${result.zhiHeMatch ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-ink-50 border-ink-200 text-ink-400'}`}>
                  {result.zhiHeMatch ? '🤝' : '○'} 地支相合{result.zhiHeMatch ? ' ✓' : ' ✗'}
                </span>
              </div>
              <div className="text-sm text-ink-600 bg-fate-50 rounded-lg p-3">
                {result.ganHeMatch && <p>🤝 天干相合，合作理念容易达成共识，沟通顺畅。</p>}
                {result.zhiHeMatch && <p>🤝 地支相合，合作中步调一致，执行层面配合默契。</p>}
                {!result.ganHeMatch && !result.zhiHeMatch && <p>双方八字无明显合象，合作需要后天磨合，建议先从小项目试水。</p>}
              </div>
            </div>

            {/* 十神互动 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 font-serif">角色定位</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-600 font-medium mb-2">甲方 → 乙方</div>
                  <div className="text-lg font-bold text-ink-800">{result.mToF_SS}</div>
                  <p className="text-sm text-ink-600 mt-2">{result.roles.mRole}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="text-sm text-emerald-600 font-medium mb-2">乙方 → 甲方</div>
                  <div className="text-lg font-bold text-ink-800">{result.fToM_SS}</div>
                  <p className="text-sm text-ink-600 mt-2">{result.roles.fRole}</p>
                </div>
              </div>
              {result.pairMatch && (
                <div className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <span className="font-bold text-amber-700">理想合作组合：{result.pairMatch.desc}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 五行互补 */}
            {result.complementDetails.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4 font-serif">资源互补</h3>
                <div className="space-y-2">
                  {result.complementDetails.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      <span className="text-ink-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 喜用神互济 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 font-serif">运势互济</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`rounded-lg p-4 ${result.mHelpF > 0 ? 'bg-green-50 border border-green-100' : 'bg-ink-50'}`}>
                  <div className="text-sm text-ink-500 mb-1">甲方旺乙方</div>
                  <div className="text-lg font-bold text-ink-800">{result.mHelpF > 0 ? '✓ 旺对方' : '○ 中性'}</div>
                  {result.mHelpF > 0 && <p className="text-sm text-green-700 mt-1">甲方喜用神五行与乙方日主一致，合作对乙方运势有助益。</p>}
                </div>
                <div className={`rounded-lg p-4 ${result.fHelpM > 0 ? 'bg-green-50 border border-green-100' : 'bg-ink-50'}`}>
                  <div className="text-sm text-ink-500 mb-1">乙方旺甲方</div>
                  <div className="text-lg font-bold text-ink-800">{result.fHelpM > 0 ? '✓ 旺对方' : '○ 中性'}</div>
                  {result.fHelpM > 0 && <p className="text-sm text-green-700 mt-1">乙方喜用神五行与甲方日主一致，合作对甲方运势有助益。</p>}
                </div>
              </div>
            </div>

            {/* 建议 */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
              <h3 className="font-bold text-lg mb-4 font-serif">💡 合作建议</h3>
              <div className="space-y-3">
                {result.suggestions.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-ink-700">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
