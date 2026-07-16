'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { analyzeCareer, analyzeBazi, getCareerAiAnalysis } from '@/lib/analysis'
import { addHistory, getHistoryByType, formatHistoryTime, type HistoryRecord } from '@/lib/history'
import { lunarToSolar, getLunarMonthOptions } from '@/lib/lunar'
import PersonFormSelector from '@/components/PersonFormSelector'

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
  aiAnalysis?: string
  _pendingAi?: boolean
}

interface PersonForm {
  name: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number
  birthMinute: number
  calendarType: 'solar' | 'lunar'
  lunarIsLeap: boolean
}

const defaultPerson: PersonForm = {
  name: '',
  birthYear: 1990,
  birthMonth: 1,
  birthDay: 1,
  birthHour: 12,
  birthMinute: 0,
  calendarType: 'solar',
  lunarIsLeap: false,
}

export default function CareerPage() {
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [result, setResult] = useState<CareerResult | null>(null)
  const [mBazi, setMBazi] = useState<any>(null)
  const [fBazi, setFBazi] = useState<any>(null)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [mForm, setMForm] = useState<PersonForm>({ ...defaultPerson, birthYear: 1990 })
  const [fForm, setFForm] = useState<PersonForm>({ ...defaultPerson, birthYear: 1992 })

  const pad = (n: number) => String(n).padStart(2, '0')

  useEffect(() => {
    setHistory(getHistoryByType('career'))
  }, [])

  const convertDate = (form: PersonForm) => {
    if (form.calendarType === 'lunar') {
      const solar = lunarToSolar(form.birthYear, form.birthMonth, form.birthDay, form.lunarIsLeap)
      if (!solar) throw new Error('农历日期转换失败')
      return { year: solar.year, month: solar.month, day: solar.day }
    }
    return { year: form.birthYear, month: form.birthMonth, day: form.birthDay }
  }

  const runAnalysis = async (mData: PersonForm, fData: PersonForm) => {
    setLoading(true)
    setAiLoading(false)

    try {
      let mSolar, fSolar
      try {
        mSolar = convertDate(mData)
        fSolar = convertDate(fData)
      } catch {
        alert('农历日期转换失败，请检查日期是否有效（如闰月是否存在）')
        setLoading(false)
        return
      }

      const mDate = `${mSolar.year}-${pad(mSolar.month)}-${pad(mSolar.day)}`
      const mTime = `${pad(mData.birthHour)}:${pad(mData.birthMinute || 0)}`
      const fDate = `${fSolar.year}-${pad(fSolar.month)}-${pad(fSolar.day)}`
      const fTime = `${pad(fData.birthHour)}:${pad(fData.birthMinute || 0)}`

      const mBaziResult = analyzeBazi(mDate, mTime, mData.name, 'male')
      const fBaziResult = analyzeBazi(fDate, fTime, fData.name, 'female')

      const careerResult = analyzeCareer(mBaziResult, fBaziResult, mData.name, fData.name)

      setMBazi(mBaziResult)
      setFBazi(fBaziResult)
      setResult(careerResult)

      // 保存查询记录
      const title = `${mData.name || '甲方'} & ${fData.name || '乙方'} · 事业合作`
      addHistory('career', title, { mForm: mData, fForm: fData }, `${careerResult.score}分 · ${careerResult.level}`)
      setHistory(getHistoryByType('career'))

      // 异步获取AI深度分析
      setAiLoading(true)
      const aiAnalysis = await getCareerAiAnalysis(
        mBaziResult,
        fBaziResult,
        mData.name,
        fData.name,
        careerResult,
      )

      if (aiAnalysis) {
        setResult((prev) => prev ? { ...prev, aiAnalysis } : null)
      }
      setAiLoading(false)
    } catch (error) {
      console.error('Error:', error)
      alert('分析出错，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    runAnalysis(mForm, fForm)
  }

  const handleHistoryClick = async (record: HistoryRecord) => {
    const m = record.formData.mForm || defaultPerson
    const f = record.formData.fForm || defaultPerson
    const mData = {
      ...m,
      calendarType: m.calendarType || 'solar',
      lunarIsLeap: m.lunarIsLeap || false,
      birthMinute: m.birthMinute || 0,
    }
    const fData = {
      ...f,
      calendarType: f.calendarType || 'solar',
      lunarIsLeap: f.lunarIsLeap || false,
      birthMinute: f.birthMinute || 0,
    }
    setMForm(mData)
    setFForm(fData)
    setShowHistory(false)
    await runAnalysis(mData, fData)
  }

  return (
    <main className="min-h-screen moonly-bg moonly-content animate-fade-in">
      <header className="bg-transparent py-4 px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-gold-gradient text-xl font-bold">事业合作分析</h1>
        </div>
      </header>

      <div className="py-4 px-4">
        {!result && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-2 font-serif">事业合作八字分析</h2>
            <p className="text-moonly-text-secondary text-sm">
              通过双方八字的五行互补、十神互动、喜用神互济等维度，评估商业合作契合度。
              适合合伙创业、项目合作、投资伙伴等场景。
            </p>
          </div>
        )}

        {!result && (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="moonly-card rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">甲</div>
                    <h3 className="font-bold text-lg">甲方信息</h3>
                  </div>
                  <PersonFormSelector form={mForm} setForm={setMForm} />
                </div>
                <div className="moonly-card rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-white/50 rounded-full flex items-center justify-center text-white text-sm font-bold">乙</div>
                    <h3 className="font-bold text-lg">乙方信息</h3>
                  </div>
                  <PersonFormSelector form={fForm} setForm={setFForm} />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-3 rounded-lg font-bold text-lg transition-all shadow-lg "
              >
                {loading ? '分析中...' : '开始事业合作分析'}
              </button>
            </form>

            {history.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-sm text-moonly-text-muted hover:text-amber-300 mb-3"
                >
                  <span>查询历史（{history.length} 条）</span>
                  <span>{showHistory ? '▲' : '▼'}</span>
                </button>
                {showHistory && (
                  <div className="moonly-card rounded-xl border border-white/10 overflow-hidden">
                    {history.map((record) => (
                      <div
                        key={record.id}
                        onClick={() => handleHistoryClick(record)}
                        className="px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition-colors"
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
          </>
        )}

        {result && (
          <div className="space-y-6">
            <button onClick={() => setResult(null)} className="text-amber-300 text-sm hover:underline">← 重新输入</button>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-sm text-moonly-text-muted mb-2">合作契合度</div>
              <div className={`text-6xl font-bold mb-2 ${result.levelColor}`}>{result.score}</div>
              <div className="flex justify-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-2xl ${i < Math.round(result.score / 20) ? 'text-amber-300' : 'text-gray-300'}`}>★</span>
                ))}
              </div>
              <div className={`text-xl font-bold ${result.levelColor}`}>{result.level}</div>
              <p className="text-moonly-text-secondary mt-2 max-w-md mx-auto">{result.levelDesc}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {mBazi && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">甲</div>
                    <span className="font-bold">{mForm.name || '甲方'}八字</span>
                  </div>
                  <div className="text-sm text-moonly-text-secondary space-y-1">
                    {mBazi.pillars.map((p: any) => (
                      <div key={p.name} className="flex justify-between">
                        <span className="text-moonly-text-muted">{p.name}</span>
                        <span className="font-medium">{p.gan}{p.zhi}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-white/10 mt-2">
                      <span className="text-moonly-text-muted">日主：</span>
                      <span className="font-bold">{mBazi.dayMaster}（{mBazi.yinYang}·{mBazi.wuXing}）</span>
                    </div>
                  </div>
                </div>
              )}
              {fBazi && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-white/50 rounded-full flex items-center justify-center text-white text-xs font-bold">乙</div>
                    <span className="font-bold">{fForm.name || '乙方'}八字</span>
                  </div>
                  <div className="text-sm text-moonly-text-secondary space-y-1">
                    {fBazi.pillars.map((p: any) => (
                      <div key={p.name} className="flex justify-between">
                        <span className="text-moonly-text-muted">{p.name}</span>
                        <span className="font-medium">{p.gan}{p.zhi}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-white/10 mt-2">
                      <span className="text-moonly-text-muted">日主：</span>
                      <span className="font-bold">{fBazi.dayMaster}（{fBazi.yinYang}·{fBazi.wuXing}）</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="moonly-card rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 font-serif">合作气场</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm ${result.ganHeMatch ? 'bg-white/5 border-white/10 text-amber-300' : 'bg-white/5 border-white/10 text-moonly-text-muted'}`}>
                  {result.ganHeMatch ? '合' : '○'} 天干相合{result.ganHeMatch ? ' ✓' : ' ✗'}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm ${result.zhiHeMatch ? 'bg-white/5 border-white/10 text-amber-300' : 'bg-white/5 border-white/10 text-moonly-text-muted'}`}>
                  {result.zhiHeMatch ? '合' : '○'} 地支相合{result.zhiHeMatch ? ' ✓' : ' ✗'}
                </span>
              </div>
              <div className="text-sm text-moonly-text-secondary moonly-card rounded-lg p-3">
                {result.ganHeMatch && <p>天干相合，合作理念容易达成共识，沟通顺畅。</p>}
                {result.zhiHeMatch && <p>地支相合，合作中步调一致，执行层面配合默契。</p>}
                {!result.ganHeMatch && !result.zhiHeMatch && <p>双方八字无明显合象，合作需要后天磨合，建议先从小项目试水。</p>}
              </div>
            </div>
            <div className="moonly-card rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 font-serif">角色定位</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-amber-300 font-medium mb-2">甲方 → 乙方</div>
                  <div className="text-lg font-bold text-white">{result.mToF_SS}</div>
                  <p className="text-sm text-moonly-text-secondary mt-2">{result.roles.mRole}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-emerald-300 font-medium mb-2">乙方 → 甲方</div>
                  <div className="text-lg font-bold text-white">{result.fToM_SS}</div>
                  <p className="text-sm text-moonly-text-secondary mt-2">{result.roles.fRole}</p>
                </div>
              </div>
              {result.pairMatch && (
                <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xl"></span>
                    <span className="font-bold text-amber-300">理想合作组合：{result.pairMatch.desc}</span>
                  </div>
                </div>
              )}
            </div>
            {result.complementDetails.length > 0 && (
              <div className="moonly-card rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 font-serif">资源互补</h3>
                <div className="space-y-2">
                  {result.complementDetails.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span className="text-moonly-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="moonly-card rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 font-serif">运势互济</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`rounded-lg p-4 ${result.mHelpF > 0 ? 'bg-white/5 border border-white/10' : 'bg-white/5'}`}>
                  <div className="text-sm text-moonly-text-muted mb-1">甲方旺乙方</div>
                  <div className="text-lg font-bold text-white">{result.mHelpF > 0 ? '✓ 旺对方' : '○ 中性'}</div>
                  {result.mHelpF > 0 && <p className="text-sm text-green-300 mt-1">甲方喜用神五行与乙方日主一致，合作对乙方运势有助益。</p>}
                </div>
                <div className={`rounded-lg p-4 ${result.fHelpM > 0 ? 'bg-white/5 border border-white/10' : 'bg-white/5'}`}>
                  <div className="text-sm text-moonly-text-muted mb-1">乙方旺甲方</div>
                  <div className="text-lg font-bold text-white">{result.fHelpM > 0 ? '✓ 旺对方' : '○ 中性'}</div>
                  {result.fHelpM > 0 && <p className="text-sm text-green-300 mt-1">乙方喜用神五行与甲方日主一致，合作对甲方运势有助益。</p>}
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 border border-white/10">
              <h3 className="font-bold text-lg mb-4 font-serif"> 合作建议</h3>
              <div className="space-y-3">
                {result.suggestions.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-moonly-text-secondary">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI 深度分析 */}
            {(aiLoading || result.aiAnalysis) && (
              <div className="moonly-card rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-gold to-amber-600 rounded-lg flex items-center justify-center text-white text-sm">
                    
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-serif">AI 深度分析</h3>
                    <p className="text-xs text-moonly-text-muted">基于双方八字的专业级合作解读</p>
                  </div>
                </div>

                {aiLoading ? (
                  <div className="flex items-center gap-3 py-8">
                    <div className="w-5 h-5 border-2 border-[#c9a96e]/[0.3] border-t-[#c9a96e] rounded-full animate-spin" />
                    <span className="text-sm text-moonly-text-muted">正在调用 Kimi AI 进行深度分析...</span>
                  </div>
                ) : result.aiAnalysis ? (
                  <div className="prose max-w-none text-moonly-text-secondary whitespace-pre-line text-sm leading-relaxed">
                    {result.aiAnalysis}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
