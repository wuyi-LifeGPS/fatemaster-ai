'use client'

import { useState, useEffect } from 'react'
import { showToast } from '@/components/Toast'
import useBeforeUnload from '@/hooks/useBeforeUnload'
import Link from 'next/link'
import { analyzeMarriage, analyzeCareer, analyzeBazi, getMatchAiAnalysis, getCareerAiAnalysis } from '@/lib/analysis'
import { addHistory, getHistoryByType, formatHistoryTime, type HistoryRecord } from '@/lib/history'
import { lunarToSolar } from '@/lib/lunar'
import CopyButton from '@/components/CopyButton'
import PersonFormSelector from '@/components/PersonFormSelector'

interface CombinedResult {
  score: number
  level: string
  levelColor: string
  levelDesc: string
  ganHeMatch: boolean
  zhiHeMatch: boolean
  sanHeMatch?: boolean
  chongMatch?: boolean
  haiMatch?: boolean
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

export default function MatchPage() {
  const [mode, setMode] = useState<'match' | 'career'>('match')
  const [loading, setLoading] = useState(false)
  const [loadingAi, setLoadingAi] = useState(false)
  const [result, setResult] = useState<CombinedResult | null>(null)
  const [mBazi, setMBazi] = useState<any>(null)
  const [fBazi, setFBazi] = useState<any>(null)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [mForm, setMForm] = useState<PersonForm>({ ...defaultPerson, birthYear: 1990 })
  const [fForm, setFForm] = useState<PersonForm>({ ...defaultPerson, birthYear: 1992 })

  useBeforeUnload(!result && (mForm.name !== '' || fForm.name !== ''))

  const pad = (n: number) => String(n).padStart(2, '0')
  const modeLabel = mode === 'match' ? '合婚分析' : '事业合作'
  const mLabel = mode === 'match' ? '男方' : '甲方'
  const fLabel = mode === 'match' ? '女方' : '乙方'
  const mTag = mode === 'match' ? '男' : '甲'
  const fTag = mode === 'match' ? '女' : '乙'
  const historyType = mode === 'match' ? 'match' : 'career'

  useEffect(() => {
    setHistory(getHistoryByType(historyType))
  }, [historyType])

  // 切换模式时清空结果
  useEffect(() => {
    setResult(null)
    setMBazi(null)
    setFBazi(null)
  }, [mode])

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
    setLoadingAi(false)

    try {
      let mSolar, fSolar
      try {
        mSolar = convertDate(mData)
        fSolar = convertDate(fData)
      } catch {
        showToast('农历日期转换失败，请检查日期是否有效（如闰月是否存在）', 'error')
        setLoading(false)
        return
      }

      const mDate = `${mSolar.year}-${pad(mSolar.month)}-${pad(mSolar.day)}`
      const mTime = `${pad(mData.birthHour)}:${pad(mData.birthMinute || 0)}`
      const fDate = `${fSolar.year}-${pad(fSolar.month)}-${pad(fSolar.day)}`
      const fTime = `${pad(fData.birthHour)}:${pad(fData.birthMinute || 0)}`

      const mBaziResult = analyzeBazi(mDate, mTime, mData.name, 'male')
      const fBaziResult = analyzeBazi(fDate, fTime, fData.name, 'female')

      let combined: CombinedResult
      if (mode === 'match') {
        combined = analyzeMarriage(mBaziResult, fBaziResult, mData.name, fData.name)
      } else {
        combined = analyzeCareer(mBaziResult, fBaziResult, mData.name, fData.name)
      }

      setMBazi(mBaziResult)
      setFBazi(fBaziResult)
      setResult(combined)

      const title = `${mData.name || mLabel} & ${fData.name || fLabel} · ${modeLabel}`
      addHistory(historyType, title, { maleForm: mData, femaleForm: fData }, `${combined.score}分 · ${combined.level}`)
      setHistory(getHistoryByType(historyType))

      // 异步获取AI深度分析
      setLoadingAi(true)
      try {
        let aiAnalysis = ''
        if (mode === 'match') {
          aiAnalysis = await getMatchAiAnalysis(mBaziResult, fBaziResult, mData.name, fData.name, combined)
        } else {
          aiAnalysis = await getCareerAiAnalysis(mBaziResult, fBaziResult, mData.name, fData.name, combined)
        }
        if (aiAnalysis) {
          setResult((prev) => prev ? { ...prev, aiAnalysis } : null)
        }
      } catch (err) {
        console.error('AI 分析失败:', err)
      } finally {
        setLoadingAi(false)
      }
    } catch (error) {
      console.error('Error:', error)
      showToast('分析出错，请重试', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // 表单验证
    const mLabelName = mode === 'match' ? '男方' : '甲方'
    const fLabelName = mode === 'match' ? '女方' : '乙方'
    if (!mForm.name.trim()) {
      showToast(`请输入${mLabelName}姓名`, 'error')
      return
    }
    if (mForm.birthYear < 1900 || mForm.birthYear > 2030) {
      showToast(`请选择有效的${mLabelName}出生年份`, 'error')
      return
    }
    if (!fForm.name.trim()) {
      showToast(`请输入${fLabelName}姓名`, 'error')
      return
    }
    if (fForm.birthYear < 1900 || fForm.birthYear > 2030) {
      showToast(`请选择有效的${fLabelName}出生年份`, 'error')
      return
    }
    runAnalysis(mForm, fForm)
  }

  const handleHistoryClick = (record: HistoryRecord) => {
    const m = record.formData.maleForm || defaultPerson
    const f = record.formData.femaleForm || defaultPerson
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
    runAnalysis(mData, fData)
  }

  const renderHeChong = (label: string, match: boolean, type: 'he' | 'chong' | 'hai') => {
    const colors = {
      he: match ? 'bg-[#c9a96e]/10 border-[#c9a96e]/30 text-[#c9a96e]' : 'bg-white/5 border-white/10 text-moonly-muted',
      chong: match ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-white/5 border-white/10 text-moonly-muted',
      hai: match ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-white/5 border-white/10 text-moonly-muted',
    }
    const icons = {
      he: match ? '✓' : '○',
      chong: match ? '!' : '○',
      hai: match ? '~' : '○',
    }
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm ${colors[type]}`}>
        <span>{icons[type]}</span>
        <span>{label}</span>
      </div>
    )
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
          <h1 className="text-gold-gradient text-xl font-bold">合婚合作</h1>
        </div>
      </header>

      <div className="py-4 px-4">
        {/* 模式切换 Tab */}
        <div className="moonly-card p-1.5 mb-6 flex gap-1">
          <button
            type="button"
            onClick={() => setMode('match')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              mode === 'match'
                ? 'bg-[#c9a96e] text-[#1a1428] '
                : 'text-moonly-muted hover:bg-white/5'
            }`}
          >
            合婚分析
          </button>
          <button
            type="button"
            onClick={() => setMode('career')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              mode === 'career'
                ? 'bg-[#c9a96e] text-[#1a1428] '
                : 'text-moonly-muted hover:bg-white/5'
            }`}
          >
            事业合作
          </button>
        </div>

        {!result && (
          <div className="moonly-card p-6 mb-6">
            <h2 className="text-base font-medium text-white mb-2 font-serif">
              {mode === 'match' ? '八字合婚' : '事业合作八字分析'}
            </h2>
            <p className="text-sm text-moonly-secondary">
              {mode === 'match'
                ? '通过双方八字的日主关系、五行互补、十神互动、喜用神互济等维度，综合评估婚配契合度。输入双方生日即可开始分析。'
                : '通过双方八字的五行互补、十神互动、喜用神互济等维度，评估商业合作契合度。适合合伙创业、项目合作、投资伙伴等场景。'}
            </p>
          </div>
        )}

        {!result && (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="moonly-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-[#c9a96e] to-amber-700`}>{mTag}</div>
                    <h3 className="font-bold text-base text-white">{mLabel}信息</h3>
                  </div>
                  <PersonFormSelector form={mForm} setForm={setMForm} />
                </div>
                <div className="moonly-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      mode === 'match' ? 'bg-gradient-to-br from-pink-400 to-pink-700' : 'bg-gradient-to-br from-blue-400 to-blue-700'
                    }`}>{fTag}</div>
                    <h3 className="font-bold text-base text-white">{fLabel}信息</h3>
                  </div>
                  <PersonFormSelector form={fForm} setForm={setFForm} />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold text-[#1a1428] py-3 font-bold text-lg transition-all disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin w-5 h-5 border-2 border-[#1a1428]/30 border-t-[#1a1428] rounded-full" />
                    分析中...
                  </span>
                ) : (mode === 'match' ? '开始合婚分析' : '开始事业合作分析')}
              </button>
            </form>

            {history.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-sm text-moonly-muted hover:text-gold transition-colors mb-3"
                >
                  <span>{modeLabel}查询历史（{history.length} 条）</span>
                  <span>{showHistory ? '▲' : '▼'}</span>
                </button>
                {showHistory && (
                  <div className="moonly-card overflow-hidden">
                    {history.map((record) => (
                      <div
                        key={record.id}
                        onClick={() => handleHistoryClick(record)}
                        className="px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm text-white">{record.title}</div>
                            <div className="text-xs text-moonly-muted mt-0.5">{record.resultSummary}</div>
                          </div>
                          <div className="text-xs text-moonly-muted whitespace-nowrap ml-2">{formatHistoryTime(record.timestamp)}</div>
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setResult(null)}
                className="btn-gold-outline px-4 py-2 text-sm"
              >
                ← 重新输入
              </button>
              <CopyButton
                text={`【${mode === 'match' ? '八字合婚' : '事业合作'}分析】\n${mLabel}：${mForm.name || '未命名'}  ${fLabel}：${fForm.name || '未命名'}\n契合度：${result.score}分 · ${result.level}\n${result.levelDesc}\n${result.suggestions.slice(0, 3).join('；')}`}
                label="分享结果"
              />
              <div className="flex-1" />
              <button
                onClick={() => setMode(mode === 'match' ? 'career' : 'match')}
                className="btn-gold-outline px-3 py-1.5 text-xs"
              >
                切换到{mode === 'match' ? '事业合作' : '合婚分析'}
              </button>
            </div>

            {/* 总评分 */}
            <div className="moonly-card p-8 text-center">
              <div className="text-sm text-moonly-muted mb-2">{mode === 'match' ? '婚配契合度' : '合作契合度'}</div>
              <div className={`text-6xl font-bold mb-2 ${result.levelColor}`}>{result.score}</div>
              <div className="flex justify-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-2xl ${i < Math.round(result.score / 20) ? 'text-[#c9a96e]' : 'text-white/15'}`}>
                    {mode === 'match' ? '❤' : '★'}
                  </span>
                ))}
              </div>
              <div className={`text-xl font-bold ${result.levelColor}`}>{result.level}</div>
              <p className="text-sm text-moonly-secondary mt-2 max-w-md mx-auto">{result.levelDesc}</p>
            </div>

            {/* 双方八字概览 */}
            <div className="grid md:grid-cols-2 gap-4">
              {mBazi && (
                <div className="moonly-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br from-[#c9a96e] to-amber-700`}>{mTag}</div>
                    <span className="font-bold text-base text-white">{mForm.name || mLabel}八字</span>
                  </div>
                  <div className="text-sm text-moonly-secondary space-y-1">
                    {mBazi.pillars.map((p: any) => (
                      <div key={p.name} className="flex justify-between">
                        <span className="text-moonly-muted">{p.name}</span>
                        <span className="font-medium text-white">{p.gan}{p.zhi}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-white/10 mt-2">
                      <span className="text-moonly-muted">日主：</span>
                      <span className="font-bold text-white">{mBazi.dayMaster}（{mBazi.yinYang}·{mBazi.wuXing}）</span>
                    </div>
                  </div>
                </div>
              )}
              {fBazi && (
                <div className="moonly-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${mode === 'match' ? 'bg-gradient-to-br from-pink-400 to-pink-700' : 'bg-gradient-to-br from-blue-400 to-blue-700'}`}>{fTag}</div>
                    <span className="font-bold text-base text-white">{fForm.name || fLabel}八字</span>
                  </div>
                  <div className="text-sm text-moonly-secondary space-y-1">
                    {fBazi.pillars.map((p: any) => (
                      <div key={p.name} className="flex justify-between">
                        <span className="text-moonly-muted">{p.name}</span>
                        <span className="font-medium text-white">{p.gan}{p.zhi}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-white/10 mt-2">
                      <span className="text-moonly-muted">日主：</span>
                      <span className="font-bold text-white">{fBazi.dayMaster}（{fBazi.yinYang}·{fBazi.wuXing}）</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 合冲关系 / 合作气场 */}
            <div className="moonly-card p-5">
              <h3 className="font-bold text-base text-white mb-4 font-serif">
                {mode === 'match' ? '合冲关系' : '合作气场'}
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {mode === 'match' ? (
                  <>
                    {renderHeChong('天干五合', result.ganHeMatch, 'he')}
                    {renderHeChong('地支六合', result.zhiHeMatch, 'he')}
                    {renderHeChong('地支三合', result.sanHeMatch || false, 'he')}
                    {renderHeChong('地支六冲', result.chongMatch || false, 'chong')}
                    {renderHeChong('地支六害', result.haiMatch || false, 'hai')}
                  </>
                ) : (
                  <>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm ${result.ganHeMatch ? 'bg-[#c9a96e]/10 border-[#c9a96e]/30 text-[#c9a96e]' : 'bg-white/5 border-white/10 text-moonly-muted'}`}>
                      {result.ganHeMatch ? '✓' : '○'} 天干相合
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm ${result.zhiHeMatch ? 'bg-[#c9a96e]/10 border-[#c9a96e]/30 text-[#c9a96e]' : 'bg-white/5 border-white/10 text-moonly-muted'}`}>
                      {result.zhiHeMatch ? '✓' : '○'} 地支相合
                    </span>
                  </>
                )}
              </div>
              <div className="moonly-card-light rounded-lg p-3">
                {mode === 'match' ? (
                  <>
                    {result.ganHeMatch && <p className="text-sm text-moonly-secondary">日主天干相合，彼此有天然的吸引力，容易产生好感。</p>}
                    {result.zhiHeMatch && <p className="text-sm text-moonly-secondary">日支六合，生活习惯、价值观容易契合，相处融洽。</p>}
                    {result.sanHeMatch && <p className="text-sm text-moonly-secondary">地支三合，缘分深厚，合作默契度高。</p>}
                    {result.chongMatch && <p className="text-sm text-moonly-secondary">日支相冲，性格差异大，容易有冲突，需要更多磨合。</p>}
                    {result.haiMatch && <p className="text-sm text-moonly-secondary">日支相害，关系中暗藏隐患，注意沟通方式。</p>}
                    {!result.ganHeMatch && !result.zhiHeMatch && !result.sanHeMatch && !result.chongMatch && !result.haiMatch && (
                      <p className="text-sm text-moonly-secondary">双方八字无明显合冲关系，属于中性组合，缘分需要后天培养。</p>
                    )}
                  </>
                ) : (
                  <>
                    {result.ganHeMatch && <p className="text-sm text-moonly-secondary">天干相合，合作理念容易达成共识，沟通顺畅。</p>}
                    {result.zhiHeMatch && <p className="text-sm text-moonly-secondary">地支相合，合作中步调一致，执行层面配合默契。</p>}
                    {!result.ganHeMatch && !result.zhiHeMatch && <p className="text-sm text-moonly-secondary">双方八字无明显合象，合作需要后天磨合，建议先从小项目试水。</p>}
                  </>
                )}
              </div>
            </div>

            {/* 十神互动 / 角色定位 */}
            <div className="moonly-card p-5">
              <h3 className="font-bold text-base text-white mb-4 font-serif">
                {mode === 'match' ? '十神互动' : '角色定位'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="moonly-card-light p-4">
                  <div className="text-sm text-[#c9a96e] font-medium mb-2">
                    {mLabel} → {fLabel}
                  </div>
                  <div className="text-lg font-bold text-white">{result.mToF_SS}</div>
                  <p className="text-sm text-moonly-secondary mt-2">{result.roles.mRole}</p>
                </div>
                <div className={`rounded-lg p-4 ${mode === 'match' ? 'moonly-card-light border border-pink-500/20' : 'moonly-card-light border border-blue-500/20'}`}>
                  <div className={`text-sm font-medium mb-2 ${mode === 'match' ? 'text-pink-300' : 'text-blue-300'}`}>
                    {fLabel} → {mLabel}
                  </div>
                  <div className="text-lg font-bold text-white">{result.fToM_SS}</div>
                  <p className="text-sm text-moonly-secondary mt-2">{result.roles.fRole}</p>
                </div>
              </div>
              {result.pairMatch && (
                <div className="mt-4 moonly-card-light p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[#c9a96e]">✦</span>
                    <span className="font-bold text-[#c9a96e]">
                      {mode === 'match' ? '理想婚配组合' : '理想合作组合'}：{result.pairMatch.desc}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 五行互补 / 资源互补 */}
            {result.complementDetails.length > 0 && (
              <div className="moonly-card p-5">
                <h3 className="font-bold text-base text-white mb-4 font-serif">
                  {mode === 'match' ? '五行互补' : '资源互补'}
                </h3>
                <div className="space-y-2">
                  {result.complementDetails.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span className="text-moonly-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 喜用神互济 / 运势互济 */}
            <div className="moonly-card p-5">
              <h3 className="font-bold text-base text-white mb-4 font-serif">
                {mode === 'match' ? '喜用神互济' : '运势互济'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`rounded-lg p-4 ${result.mHelpF > 0 ? 'moonly-card-light border border-green-500/20' : 'moonly-card-light'}`}>
                  <div className="text-sm text-moonly-muted mb-1">{mLabel}旺{fLabel}</div>
                  <div className="text-lg font-bold text-white">{result.mHelpF > 0 ? '✓ 旺对方' : '○ 中性'}</div>
                  {result.mHelpF > 0 && (
                    <p className="text-sm text-green-300 mt-1">
                      {mLabel}喜用神五行与{fLabel}日主一致，对{fLabel}有助益。
                    </p>
                  )}
                </div>
                <div className={`rounded-lg p-4 ${result.fHelpM > 0 ? 'moonly-card-light border border-green-500/20' : 'moonly-card-light'}`}>
                  <div className="text-sm text-moonly-muted mb-1">{fLabel}旺{mLabel}</div>
                  <div className="text-lg font-bold text-white">{result.fHelpM > 0 ? '✓ 旺对方' : '○ 中性'}</div>
                  {result.fHelpM > 0 && (
                    <p className="text-sm text-green-300 mt-1">
                      {fLabel}喜用神五行与{mLabel}日主一致，对{mLabel}有助益。
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 建议 */}
            <div className="moonly-card p-5">
              <h3 className="font-bold text-base text-white mb-4 font-serif">
                {mode === 'match' ? '婚配建议' : '合作建议'}
              </h3>
              <div className="space-y-3">
                {result.suggestions.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-moonly-secondary">
                    <span className="text-[#c9a96e] mt-0.5">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI 深度分析 */}
            {(loadingAi || result.aiAnalysis) && (
              <div className="moonly-card p-5 border border-[#c9a96e]/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#c9a96e] to-amber-700 rounded-lg flex items-center justify-center text-white text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white font-serif">AI 深度分析</h3>
                    <p className="text-xs text-moonly-muted">基于双方八字的专业级{mode === 'match' ? '婚配' : '合作'}解读</p>
                  </div>
                </div>

                {loadingAi ? (
                  <div className="flex items-center gap-3 py-8">
                    <div className="animate-spin w-5 h-5 border-2 border-[#c9a96e]/30 border-t-[#c9a96e] rounded-full" />
                    <span className="text-sm text-moonly-muted">正在调用 Kimi AI 进行深度分析...</span>
                  </div>
                ) : result.aiAnalysis ? (
                  <div className="prose max-w-none text-moonly-secondary whitespace-pre-line text-sm leading-relaxed">
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
