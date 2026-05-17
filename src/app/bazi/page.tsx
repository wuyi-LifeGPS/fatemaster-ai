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
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
    birthMinute: 0,
    birthPlace: '',
    note: '',
  })

  // 生成日期/时间选项
  const yearOptions = Array.from({length: 131}, (_, i) => 1900 + i)
  const monthOptions = Array.from({length: 12}, (_, i) => i + 1)
  const dayOptions = Array.from({length: 31}, (_, i) => i + 1)
  const hourOptions = Array.from({length: 24}, (_, i) => i)
  const minuteOptions = Array.from({length: 12}, (_, i) => i * 5)

  const pad = (n: number) => String(n).padStart(2, '0')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 从设置中读取 API Key（如果有）
      const settings = localStorage.getItem('lifegps_settings')
      const apiKey = settings ? JSON.parse(settings).kimiApiKey : undefined

      const birthDate = `${formData.birthYear}-${pad(formData.birthMonth)}-${pad(formData.birthDay)}`
      const birthTime = `${pad(formData.birthHour)}:${pad(formData.birthMinute)}`

      // 前端直接计算八字 + 生成基础分析
      const result = analyzeBazi(
        birthDate,
        birthTime,
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
                <div className="flex gap-2">
                  <select
                    value={formData.birthYear}
                    onChange={(e) => setFormData({ ...formData, birthYear: Number(e.target.value) })}
                    className="flex-1 px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400 bg-white"
                  >
                    {yearOptions.map(y => <option key={y} value={y}>{y}年</option>)}
                  </select>
                  <select
                    value={formData.birthMonth}
                    onChange={(e) => setFormData({ ...formData, birthMonth: Number(e.target.value) })}
                    className="w-20 px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400 bg-white"
                  >
                    {monthOptions.map(m => <option key={m} value={m}>{m}月</option>)}
                  </select>
                  <select
                    value={formData.birthDay}
                    onChange={(e) => setFormData({ ...formData, birthDay: Number(e.target.value) })}
                    className="w-20 px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400 bg-white"
                  >
                    {dayOptions.map(d => <option key={d} value={d}>{d}日</option>)}
                  </select>
                </div>
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
