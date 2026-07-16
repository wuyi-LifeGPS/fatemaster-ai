'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { analyzeBazi } from '@/lib/analysis'
import { addHistory, getHistoryByType, formatHistoryTime, type HistoryRecord } from '@/lib/history'
import { lunarToSolar } from '@/lib/lunar'
import PersonFormSelector from '@/components/PersonFormSelector'
import { analyzeTalent, type TalentResult, getTalentAiAnalysis, getScoreColor } from '@/lib/talent'
import TalentRadar from '@/components/TalentRadar'

interface FormData {
  name: string
  gender: 'male' | 'female'
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number
  birthMinute: number
  birthPlace: string
  note: string
  calendarType: 'solar' | 'lunar'
  lunarIsLeap: boolean
}

export default function TalentPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TalentResult | null>(null)
  const [baziResult, setBaziResult] = useState<any>(null)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [solarBirthDate, setSolarBirthDate] = useState('')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: 'male',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
    birthMinute: 0,
    birthPlace: '',
    note: '',
    calendarType: 'solar',
    lunarIsLeap: false,
  })

  const pad = (n: number) => String(n).padStart(2, '0')

  useEffect(() => {
    setHistory(getHistoryByType('talent'))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAiAnalysis('')

    try {
      // 农历转公历
      let solarYear = formData.birthYear
      let solarMonth = formData.birthMonth
      let solarDay = formData.birthDay
      if (formData.calendarType === 'lunar') {
        const solar = lunarToSolar(formData.birthYear, formData.birthMonth, formData.birthDay, formData.lunarIsLeap)
        if (!solar) {
          alert('农历日期转换失败，请检查日期是否有效')
          setLoading(false)
          return
        }
        solarYear = solar.year
        solarMonth = solar.month
        solarDay = solar.day
      }

      const birthDate = `${solarYear}-${pad(solarMonth)}-${pad(solarDay)}`
      setSolarBirthDate(birthDate)
      const birthTime = `${pad(formData.birthHour)}:${pad(formData.birthMinute)}`

      // 计算八字
      const bazi = analyzeBazi(birthDate, birthTime, formData.name, formData.gender, formData.note)
      setBaziResult(bazi)

      // 计算天赋
      const talent = analyzeTalent(bazi, formData.gender)
      setResult(talent)

      // 保存历史
      const summary = `主导天赋：${talent.dimensions[0].name} · ${talent.dimensions[0].score}分`
      addHistory('talent', formData.name || `天赋分析 ${birthDate}`, formData, summary)
      setHistory(getHistoryByType('talent'))

      // 异步AI分析
      setAiLoading(true)
      const aiText = await getTalentAiAnalysis(bazi, talent, formData.name, formData.gender)
      if (aiText) setAiAnalysis(aiText)
    } catch (error) {
      console.error('Error:', error)
      alert('分析出错，请重试')
    } finally {
      setLoading(false)
      setAiLoading(false)
    }
  }

  const loadHistory = (record: HistoryRecord) => {
    setFormData({
      ...record.formData,
      calendarType: record.formData.calendarType || 'solar',
      lunarIsLeap: record.formData.lunarIsLeap || false,
    })
    setShowHistory(false)
    setResult(null)
    setAiAnalysis('')
  }

  // 雷达图数据
  const radarData = result?.dimensions.map((d) => ({
    label: d.label,
    fullLabel: d.name,
    value: d.score,
    color: getScoreColor(d.score),
  })) || []

  // 颜色映射
  const wxColor: Record<string, string> = {
    '金': 'text-amber-400',
    '木': 'text-green-400',
    '水': 'text-blue-400',
    '火': 'text-red-400',
    '土': 'text-yellow-400',
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
          <h1 className="text-gold-gradient text-xl font-bold">天赋分析</h1>
        </div>
      </header>

      <div className="py-4 px-4">
        {!result ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-serif mb-2 text-white">天赋基因解码</h2>
              <p className="text-sm text-moonly-text-muted">融合八字命理 × 加德纳多元智能理论，发现你的天赋密码</p>
            </div>

            <form onSubmit={handleSubmit} className="moonly-card p-6 max-w-lg mx-auto">
              <div className="mb-4">
                <PersonFormSelector form={formData} setForm={setFormData as any} showGender={true} />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1.5 text-moonly-text-secondary">出生地点（可选）</label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-moonly-gold/30 text-white placeholder-moonly-text-muted"
                  placeholder="如：北京"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5 text-moonly-text-secondary">备注（可选）</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-moonly-gold/30 text-white placeholder-moonly-text-muted"
                  placeholder="如有特殊需求或想了解的具体问题，可在此填写"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold text-[#1a1428] py-3 font-medium transition-all disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin w-5 h-5 border-2 border-[#1a1428]/30 border-t-[#1a1428] rounded-full" />
                    正在解码天赋基因...
                  </span>
                ) : '开始天赋分析'}
              </button>
            </form>

            {/* 历史记录 */}
            {history.length > 0 && (
              <div className="mt-6 max-w-lg mx-auto">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-sm text-moonly-text-muted hover:text-gold transition-colors mb-3"
                >
                  <span>查询历史（{history.length} 条）</span>
                  <span>{showHistory ? '▲' : '▼'}</span>
                </button>
                {showHistory && (
                  <div className="moonly-card overflow-hidden">
                    {history.map((record) => (
                      <div
                        key={record.id}
                        onClick={() => loadHistory(record)}
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
        ) : (
          <div className="space-y-6">
            {/* 头部导航 */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setResult(null)
                  setAiAnalysis('')
                  setBaziResult(null)
                }}
                className="btn-gold-outline px-4 py-2 text-sm"
              >
                ← 重新分析
              </button>
              <h2 className="text-xl font-bold font-serif text-white">天赋分析报告</h2>
            </div>

            {/* 八字概览 */}
            <div className="moonly-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-lg font-bold text-white">{formData.name || '命主'}</span>
                <span className="text-moonly-text-muted">·</span>
                <span className="text-sm text-moonly-text-muted">
                  {baziResult?.dayMaster}日主 · {baziResult?.yinYang}性{baziResult?.wuXing}命
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {baziResult?.pillars.map((pillar: {name: string; gan: string; zhi: string}) => {
                  const ganWx: Record<string, string> = {
                    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土',
                    '庚': '金', '辛': '金', '壬': '水', '癸': '水',
                  }
                  const zhiWx: Record<string, string> = {
                    '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
                    '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
                  }
                  return (
                  <div key={pillar.name} className="moonly-card-light p-3 text-center">
                    <div className="text-xs text-moonly-text-muted mb-1">{pillar.name}</div>
                    <div className="flex items-center justify-center gap-1.5">
                      <span className={`text-xl font-bold ${wxColor[ganWx[pillar.gan]] || 'text-white/60'}`}>{pillar.gan}</span>
                      <span className={`text-xl font-bold ${wxColor[zhiWx[pillar.zhi]] || 'text-white/60'}`}>{pillar.zhi}</span>
                    </div>
                  </div>
                  )
                })}
              </div>
            </div>

            {/* 雷达图 */}
            <div className="moonly-card p-5">
              <h3 className="text-base font-medium text-white mb-1 font-serif">多元智能雷达图</h3>
              <p className="text-xs text-moonly-text-muted mb-6">基于八字五行能量与十神格局的天赋评估</p>
              <TalentRadar data={radarData} size={360} />
              <p className="text-center text-xs text-moonly-text-muted mt-4">
                分值 0-100 · 基于五行分布、十神透出、日主特质、格局类型综合计算
              </p>
            </div>

            {/* 天赋模式 */}
            <div className="moonly-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-medium text-white font-serif">天赋模式</h3>
              </div>
              <p className="text-sm text-moonly-text-secondary leading-relaxed mb-4">{result.patternDescription}</p>
              <div className="flex flex-wrap gap-2">
                {result.top3.map((key, i) => {
                  const dim = result.dimensions.find((d) => d.key === key)
                  if (!dim) return null
                  return (
                    <span
                      key={key}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                        i === 0
                          ? 'bg-moonly-gold/15 text-moonly-gold border border-moonly-gold/20'
                          : i === 1
                          ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20'
                          : 'bg-blue-500/15 text-blue-300 border border-blue-500/20'
                      }`}
                    >
                      <span>{dim.icon}</span>
                      <span>
                        #{i + 1} {dim.name}
                      </span>
                      <span className="opacity-60">{dim.score}分</span>
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Top3 天赋详解 */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-white font-serif">天赋详解</h3>
              {result.top3.map((key, i) => {
                const dim = result.dimensions.find((d) => d.key === key)
                if (!dim) return null
                const color = getScoreColor(dim.score)
                return (
                  <div
                    key={key}
                    className="moonly-card p-5 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{dim.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-medium text-white">{dim.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-moonly-text-secondary">{dim.level}</span>
                        </div>
                      </div>
                      <span className="text-2xl font-bold" style={{ color }}>
                        {dim.score}
                      </span>
                    </div>

                    {/* 进度条 */}
                    <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                      <div
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${dim.score}%`, backgroundColor: color }}
                      />
                    </div>

                    <p className="text-sm text-moonly-text-muted mb-3">{dim.description}</p>

                    {/* 日常表现对照 */}
                    <div className="moonly-card-light p-3 mb-3">
                      <p className="text-xs text-moonly-gold mb-1.5 font-medium">日常表现对照</p>
                      <div className="space-y-1">
                        {dim.dailySigns.map((s: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-moonly-text-muted mt-0.5 text-[10px]">○</span>
                            <span className="text-moonly-text-muted text-sm">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 优势列表 */}
                    <div className="space-y-1.5">
                      {dim.strengths.map((s, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-moonly-gold mt-0.5">✓</span>
                          <span className="text-moonly-text-secondary">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 所有维度一览 */}
            <div className="moonly-card p-5">
              <h3 className="text-base font-medium text-white mb-4 font-serif">八维天赋全景</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {result.dimensions.map((dim) => {
                  const color = getScoreColor(dim.score)
                  const isTop3 = result.top3.includes(dim.key)
                  return (
                    <div
                      key={dim.key}
                      className={`p-3 rounded-lg border transition-all ${
                        isTop3 ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm">{dim.icon}</span>
                        <span className="text-xs text-moonly-text-muted">{dim.label}</span>
                      </div>
                      <div className="text-lg font-bold" style={{ color }}>
                        {dim.score}
                      </div>
                      <div className="text-xs text-moonly-text-muted">{dim.level}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 职业建议 */}
            <div className="moonly-card p-5">
              <h3 className="text-base font-medium text-white mb-4 font-serif">职业方向建议</h3>
              <div className="space-y-4">
                {result.careerSuggestions.map((career, i) => (
                  <div
                    key={career.field}
                    className="flex items-start gap-4 p-4 rounded-lg moonly-card-light hover:border-white/15 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-moonly-gold/20 flex items-center justify-center text-lg font-bold text-moonly-gold">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{career.field}</span>
                        <span className="text-xs text-moonly-gold bg-white/10 px-2 py-0.5 rounded-full">
                          匹配度 {Math.round(career.matchScore)}%
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {career.roles.map((role) => (
                          <span
                            key={role}
                            className="text-xs bg-white/10 text-moonly-text-muted px-2 py-0.5 rounded"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-moonly-text-muted">{career.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 人生发展建议 */}
            <div className="moonly-card p-5">
              <h3 className="text-base font-medium text-white mb-4 font-serif">人生发展建议</h3>
              <div className="prose prose-sm max-w-none">
                {result.lifeAdvice.split('\n\n').map((para, i) => {
                  if (para.startsWith('**') && para.includes('**')) {
                    const parts = para.split('**：')
                    if (parts.length >= 2) {
                      const title = parts[0].replace(/\*\*/g, '')
                      const content = parts.slice(1).join('**：')
                      return (
                        <div key={i} className="mb-4 last:mb-0">
                          <h4 className="text-moonly-gold font-bold mb-1">{title}</h4>
                          <p className="text-moonly-text-muted leading-relaxed">{content}</p>
                        </div>
                      )
                    }
                  }
                  return (
                    <p key={i} className="text-moonly-text-muted leading-relaxed mb-3 last:mb-0">
                      {para.replace(/\*\*/g, '')}
                    </p>
                  )
                })}
              </div>
            </div>

            {/* AI 深度解读 */}
            {aiLoading && (
              <div className="moonly-card p-5 border border-moonly-gold/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-moonly-gold to-amber-700 rounded-lg flex items-center justify-center text-white text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white font-serif">AI 深度解读</h3>
                    <p className="text-xs text-moonly-text-muted">基于八字命理的个性化天赋分析</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-8">
                  <div className="animate-spin w-5 h-5 border-2 border-moonly-gold/30 border-t-moonly-gold rounded-full" />
                  <span className="text-sm text-moonly-text-muted">AI 正在深度解读你的天赋基因...</span>
                </div>
              </div>
            )}

            {aiAnalysis && (
              <div className="moonly-card p-5 border border-moonly-gold/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-moonly-gold to-amber-700 rounded-lg flex items-center justify-center text-white text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white font-serif">AI 深度解读</h3>
                    <p className="text-xs text-moonly-text-muted">基于八字命理的个性化天赋分析</p>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none whitespace-pre-line text-moonly-text-secondary leading-relaxed">
                  {aiAnalysis}
                </div>
              </div>
            )}

            {!aiAnalysis && !aiLoading && (
              <div className="text-center py-4">
                <p className="text-moonly-text-muted text-sm">AI 深度解读已自动加载中...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
