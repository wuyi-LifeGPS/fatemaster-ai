'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { analyzeBazi, getAiAnalysis } from '@/lib/analysis'
import { addHistory, getHistoryByType, formatHistoryTime, type HistoryRecord } from '@/lib/history'
import { lunarToSolar, getLunarMonthOptions } from '@/lib/lunar'
import DaYunFlow from '@/components/DaYunFlow'

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
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [solarBirthDate, setSolarBirthDate] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
    birthMinute: 0,
    birthPlace: '',
    note: '',
    calendarType: 'solar' as 'solar' | 'lunar',
    lunarIsLeap: false,
  })

  // 生成日期/时间选项
  const isLunar = formData.calendarType === 'lunar'
  const yearOptions = isLunar
    ? Array.from({length: 131}, (_, i) => 1900 + i)
    : Array.from({length: 131}, (_, i) => 1900 + i)
  const monthOptions = isLunar
    ? getLunarMonthOptions(formData.birthYear)
    : Array.from({length: 12}, (_, i) => i + 1).map(m => ({ value: m, label: `${m}月`, isLeap: false }))
  const dayOptions = Array.from({length: 30}, (_, i) => i + 1)
  const hourOptions = Array.from({length: 24}, (_, i) => i)
  const minuteOptions = Array.from({length: 12}, (_, i) => i * 5)

  const pad = (n: number) => String(n).padStart(2, '0')

  // 加载历史记录
  useEffect(() => {
    setHistory(getHistoryByType('bazi'))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      setSolarBirthDate(birthDate)
      const birthTime = `${pad(formData.birthHour)}:${pad(formData.birthMinute)}`

      // 前端直接计算八字 + 生成基础分析
      const result = analyzeBazi(
        birthDate,
        birthTime,
        formData.name,
        formData.gender,
        formData.note,
      )

      setResult(result)

      // 保存查询记录
      const summary = `${result.dayMaster}日主 · ${result.yinYang}性${result.wuXing}命 · ${result.bodyStrength?.strength || '未知'}`
      addHistory('bazi', formData.name || `八字分析 ${birthDate}`, formData, summary)
      setHistory(getHistoryByType('bazi'))

      // 异步获取 AI 深度分析
      const aiAnalysis = await getAiAnalysis(
        {
          ...result,
          combinedGod: (result as any).combinedGod,
          bodyStrength: result.bodyStrength,
          pattern: result.pattern,
          cangGanDetail: result.cangGanDetail,
        },
        formData.name,
        formData.gender,
        'bazi',
        formData.note,
      )

      if (aiAnalysis) {
        setResult((prev) => prev ? { ...prev, aiAnalysis } : null)
      }
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
    })
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
                {/* 公历/农历切换 */}
                <div className="flex gap-1 mb-2 bg-fate-100 rounded-lg p-1 w-fit">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, calendarType: 'solar', lunarIsLeap: false })}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      formData.calendarType === 'solar'
                        ? 'bg-white text-ink-800 shadow-sm'
                        : 'text-ink-500 hover:text-ink-700'
                    }`}
                  >
                    公历
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, calendarType: 'lunar' })}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      formData.calendarType === 'lunar'
                        ? 'bg-white text-ink-800 shadow-sm'
                        : 'text-ink-500 hover:text-ink-700'
                    }`}
                  >
                    农历
                  </button>
                </div>
                <div className="flex gap-2">
                  <select
                    value={formData.birthYear}
                    onChange={(e) => setFormData({ ...formData, birthYear: Number(e.target.value) })}
                    className="flex-1 px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400 bg-white"
                  >
                    {yearOptions.map(y => <option key={y} value={y}>{y}年</option>)}
                  </select>
                  <select
                    value={`${formData.lunarIsLeap ? 'leap-' : ''}${formData.birthMonth}`}
                    onChange={(e) => {
                      const val = e.target.value
                      const isLeap = val.startsWith('leap-')
                      const month = Number(isLeap ? val.replace('leap-', '') : val)
                      setFormData({ ...formData, birthMonth: month, lunarIsLeap: isLeap })
                    }}
                    className="w-28 px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400 bg-white"
                  >
                    {monthOptions.map(m => (
                      <option key={`${m.isLeap ? 'leap-' : ''}${m.value}`} value={`${m.isLeap ? 'leap-' : ''}${m.value}`}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.birthDay}
                    onChange={(e) => setFormData({ ...formData, birthDay: Number(e.target.value) })}
                    className="w-20 px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400 bg-white"
                  >
                    {dayOptions.map(d => <option key={d} value={d}>{d}日</option>)}
                  </select>
                </div>
                {formData.calendarType === 'lunar' && (
                  <p className="text-xs text-ink-400 mt-1"></p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">出生时间 *</label>
                <div className="flex gap-2 items-center">
                  <select
                    value={formData.birthHour}
                    onChange={(e) => setFormData({ ...formData, birthHour: Number(e.target.value) })}
                    className="w-24 px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400 bg-white"
                  >
                    {hourOptions.map(h => <option key={h} value={h}>{pad(h)}</option>)}
                  </select>
                  <span className="text-ink-400">:</span>
                  <select
                    value={formData.birthMinute}
                    onChange={(e) => setFormData({ ...formData, birthMinute: Number(e.target.value) })}
                    className="w-24 px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400 bg-white"
                  >
                    {minuteOptions.map(m => <option key={m} value={m}>{pad(m)}</option>)}
                  </select>
                </div>
                <p className="text-xs text-ink-400 mt-1">24小时制，不确定可默认 12:00</p>
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

            {/* 历史记录 */}
            {history.length > 0 && (
              <div className="mt-6 max-w-lg mx-auto">
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {result.pillars.map((pillar) => (
                  <div key={pillar.name} className="border border-fate-100 rounded-lg p-3 sm:p-4">
                    <div className="text-sm text-ink-500 mb-2">{pillar.name}</div>
                    <div className="text-2xl font-bold text-fate-700">{pillar.gan}{pillar.zhi}</div>
                    <div className="text-xs text-ink-400 mt-1">
                      {result.tenGods[pillar.gan] && (
                        <div className="text-xs text-ink-400">
                          <span className="text-ink-300">天干:</span> {result.tenGods[pillar.gan]}
                        </div>
                      )}
                      {result.tenGods[pillar.zhi] && (
                        <div className="text-xs text-ink-400">
                          <span className="text-ink-300">地支:</span> {result.tenGods[pillar.zhi]}
                        </div>
                      )}
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
              <div className="space-y-3">
                {(() => {
                  const ganToWx: Record<string, string> = {
                    '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土',
                    '庚':'金','辛':'金','壬':'水','癸':'水'
                  };
                  const wxColors: Record<string, string> = {
                    '金': '#B8860B', '木': '#228B22', '水': '#1E90FF',
                    '火': '#DC143C', '土': '#DAA520'
                  };

                  return ['金','木','水','火','土'].map(wx => {
                    const total = result.wuXingFullCount?.[wx] || 0;
                    const barWidth = Math.min((total / 10) * 100, 100);

                    // 收集该五行的所有来源
                    const sources: {type:string, text:string}[] = [];

                    // 天干透出
                    result.pillars.forEach((p: any) => {
                      if (ganToWx[p.gan] === wx) {
                        const ss = result.tenGods?.[p.gan] || '';
                        sources.push({type:'天干', text:`${p.gan}(${p.name}·${ss})`});
                      }
                    });

                    // 地支藏干
                    result.cangGanDetail?.forEach((cg: any) => {
                      cg.cangGan.forEach((item: any) => {
                        if (ganToWx[item.gan] === wx) {
                          sources.push({type:item.qi, text:`${item.gan}(${cg.zhi}·${item.shiShen})`});
                        }
                      });
                    });

                    return (
                      <div key={wx} className="border-b border-fate-100 last:border-0 pb-3 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-lg" style={{color: wxColors[wx]}}>{wx}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-fate-700">{total}</span>
                            <div className="w-16 bg-fate-100 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full" style={{width: `${barWidth}%`, backgroundColor: wxColors[wx]}} />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {sources.length === 0 ? (
                            <span className="text-xs text-ink-400">无</span>
                          ) : sources.map((s, i) => (
                            <span key={i} className="text-xs bg-fate-50 px-2 py-1 rounded text-ink-600">
                              <span className="text-ink-400 mr-1">{s.type}:</span>{s.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
              <p className="text-xs text-ink-400 mt-4">总计含天干 + 地支全部藏干（本气·中气·余气）。天干透出能量最强，藏干为潜在能量。</p>
            </div>

            {/* 大运流年 */}
            {result.pillars && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4 font-serif">大运流年</h3>
                <DaYunFlow
                  bazi={result}
                  gender={formData.gender}
                  name={formData.name}
                  birthDate={solarBirthDate}
                />
              </div>
            )}

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
