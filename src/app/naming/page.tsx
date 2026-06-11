'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { calculateBazi } from '@/lib/bazi'
import { calculateCombinedGod } from '@/lib/analysis'
import { lunarToSolar } from '@/lib/lunar'
import PersonFormSelector from '@/components/PersonFormSelector'
import {
  analyzeName,
  analyzeBrandName,
  getNameWuxing,
  calculateWuxingMatch,
  type NameAnalysis,
} from '@/lib/naming'
import { addHistory, getHistoryByType, formatHistoryTime, type HistoryRecord } from '@/lib/history'

export default function NamingPage() {
  const [mode, setMode] = useState<'analyze' | 'generate' | 'brand'>('analyze')
  const [surname, setSurname] = useState('')
  const [givenName, setGivenName] = useState('')
  const [analysis, setAnalysis] = useState<NameAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const [brandName, setBrandName] = useState('')
  const [brandResult, setBrandResult] = useState<any>(null)

  // 出生信息 - 复用八字页面的选择器
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
    birthMinute: 0,
    calendarType: 'solar' as 'solar' | 'lunar',
    lunarIsLeap: false,
  })
  const [baziInfo, setBaziInfo] = useState<any>(null)
  const [combinedGod, setCombinedGod] = useState<any>(null)
  const [wuxingMatch, setWuxingMatch] = useState<any>(null)

  // 加载历史记录
  useEffect(() => {
    setHistory(getHistoryByType('naming'))
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  const handleAnalyze = () => {
    if (mode === 'brand') {
      if (!brandName) return
      setLoading(true)
      setBrandResult(null) // 先清空旧结果，防止残留
      setTimeout(() => {
        const result = analyzeBrandName(brandName)
        setBrandResult(result)
        addHistory('naming', `${brandName} · 品牌分析`, { mode: 'brand', brandName }, `${result.brandScore}分`)
        setHistory(getHistoryByType('naming'))
        setLoading(false)
      }, 500)
      return
    }

    if (!surname || (mode === 'analyze' && !givenName)) return
    setLoading(true)

    setTimeout(() => {
      // 1. 如果有出生信息，计算八字
      let bazi = null
      let god = null
      let wxMatch = null

      // 农历转公历
      let solarYear = formData.birthYear
      let solarMonth = formData.birthMonth
      let solarDay = formData.birthDay
      if (formData.calendarType === 'lunar') {
        const solar = lunarToSolar(formData.birthYear, formData.birthMonth, formData.birthDay, formData.lunarIsLeap)
        if (solar) {
          solarYear = solar.year
          solarMonth = solar.month
          solarDay = solar.day
        }
      }
      const birthDate = `${solarYear}-${pad(solarMonth)}-${pad(solarDay)}`
      const birthTime = `${pad(formData.birthHour)}:${pad(formData.birthMinute)}`

      if (birthDate && birthTime) {
        try {
          bazi = calculateBazi(birthDate, birthTime)
          god = calculateCombinedGod(bazi)
          setBaziInfo(bazi)
          setCombinedGod(god)

          // 计算名字五行与喜用神匹配
          const fullName = surname + givenName
          const nameWuxing = getNameWuxing(fullName)
          wxMatch = calculateWuxingMatch(
            nameWuxing,
            god.xi || [],
            god.ji || []
          )
          setWuxingMatch(wxMatch)
        } catch (e) {
          console.error('八字计算出错:', e)
        }
      }

      // 2. 算五格
      const result = analyzeName(surname, givenName)

      // 3. 如果有五行匹配，综合到总分
      if (wxMatch) {
        const wuxingWeight = 0.3
        const baseScore = result.overallScore
        const wuxingScore = wxMatch.score
        result.overallScore = Math.round(
          baseScore * (1 - wuxingWeight) + wuxingScore * wuxingWeight
        )
      }

      // 保存查询记录
      const title = mode === 'analyze'
        ? `${surname}${givenName} · 名字分析`
        : `${surname} · AI起名`
      addHistory('naming', title, { mode, surname, givenName, formData }, `${result.overallScore}分`)
      setHistory(getHistoryByType('naming'))

      setAnalysis(result)
      setLoading(false)
    }, 500)
  }

  const handleHistoryClick = (record: HistoryRecord) => {
    const data = record.formData
    if (data.mode) {
      setMode(data.mode)
      setAnalysis(null)
      setBrandResult(null)
    }
    if (data.brandName) {
      setBrandName(data.brandName)
      setBrandResult(null)
    }
    if (data.surname) setSurname(data.surname)
    if (data.givenName !== undefined) setGivenName(data.givenName)
    if (data.formData) {
      setFormData({
        ...formData,
        ...data.formData,
        calendarType: data.formData.calendarType || 'solar',
        lunarIsLeap: data.formData.lunarIsLeap || false,
      })
    }
    setShowHistory(false)
  }

  const getLevelColor = (level: string) => {
    if (level === '吉') return 'text-green-600 bg-green-50'
    if (level === '凶') return 'text-red-600 bg-red-50'
    return 'text-yellow-600 bg-yellow-50'
  }

  const getWuxingColor = (wx: string) => {
    if (wx === '金') return 'text-amber-600'
    if (wx === '木') return 'text-green-600'
    if (wx === '水') return 'text-blue-600'
    if (wx === '火') return 'text-red-600'
    return 'text-yellow-700'
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-[#0a0e27]/80 backdrop-blur-sm border-b border-white/10 text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif">
            ← AI 命理大师
          </Link>
          <h1 className="text-lg font-serif">姓名学分析</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 模式切换 */}
        <div className="bg-white rounded-xl shadow-sm p-1 mb-6 flex">
          <button
            onClick={() => { setMode('analyze'); setAnalysis(null); setBrandResult(null) }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'analyze' ? 'bg-blue-50 text-fate-800' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            名字分析
          </button>
          <button
            onClick={() => { setMode('generate'); setAnalysis(null); setBrandResult(null) }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'generate' ? 'bg-blue-50 text-fate-800' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            AI起名
          </button>
          <button
            onClick={() => { setMode('brand'); setAnalysis(null); setBrandResult(null) }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'brand' ? 'bg-blue-50 text-fate-800' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            品牌分析
          </button>
        </div>

        {/* 输入区 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* 出生信息（可选） */}
          <div className="mb-6 p-4 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-gray-700">
                📅 出生信息（可选，填写后结合八字喜用神分析更精准）
              </h3>
            </div>
            
            <PersonFormSelector form={formData} setForm={setFormData as any} showGender={true} />
          </div>

          {/* 姓名输入 */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">{mode === 'brand' ? '公司/品牌名' : '姓氏'}</label>
              <input
                type="text"
                value={mode === 'brand' ? brandName : surname}
                onChange={(e) => mode === 'brand' ? setBrandName(e.target.value) : setSurname(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-center text-lg"
                placeholder={mode === 'brand' ? '如：华为' : '如：张'}
                maxLength={mode === 'brand' ? 10 : 2}
              />
            </div>
            {mode !== 'brand' && (
            <div className="flex-[2]">
              <label className="block text-sm font-medium mb-1">
                {mode === 'analyze' ? '名字' : '期望用字（可选）'}
              </label>
              <input
                type="text"
                value={givenName}
                onChange={(e) => setGivenName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-center text-lg"
                placeholder={mode === 'analyze' ? '如：伟' : '可选填期望字'}
                maxLength={4}
              />
            </div>
            )}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={
              (mode === 'brand' && !brandName) ||
              (mode !== 'brand' && (!surname || (mode === 'analyze' && !givenName))) ||
              loading
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? '分析中...' : mode === 'analyze' ? '分析名字' : mode === 'brand' ? '分析品牌名' : 'AI智能起名'}
          </button>
        </div>

        {/* 历史记录 */}
        {history.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-blue-600 mb-3"
            >
              <span>📜</span>
              <span>查询历史（{history.length} 条）</span>
              <span>{showHistory ? '▲' : '▼'}</span>
            </button>
            {showHistory && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {history.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => handleHistoryClick(record)}
                    className="px-4 py-3 border-b border-fate-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm text-gray-800">{record.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{record.resultSummary}</div>
                      </div>
                      <div className="text-xs text-gray-400 whitespace-nowrap ml-2">{formatHistoryTime(record.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 分析结果 */}
        {analysis && mode === 'analyze' && (
          <div className="space-y-6">
            {/* 八字概览（如果有） */}
            {baziInfo && combinedGod && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold font-serif">八字命盘概览</h2>
                  <div className="text-sm text-gray-400">
                    {baziInfo.dayMaster}日主 · {baziInfo.yinYang}性{baziInfo.wuXing}命
                  </div>
                </div>

                {/* 四柱 */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {baziInfo.pillars.map((p: any) => (
                    <div key={p.name} className="text-center p-2 bg-white rounded">
                      <div className="text-xs text-gray-400 mb-1">{p.name}</div>
                      <div className="text-lg font-bold">
                        <span className={getWuxingColor(baziInfo.tenGods[p.gan] ? '未知' : baziInfo.wuXing)}>
                          {p.gan}
                        </span>
                        <span className={getWuxingColor(baziInfo.wuXing)}>{p.zhi}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 喜用神 */}
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div>
                      <span className="text-sm text-gray-500">喜用神：</span>
                      <span className="font-bold text-green-600">
                        {combinedGod.xi?.join('、') || '无'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">忌神：</span>
                      <span className="font-bold text-red-600">
                        {combinedGod.ji?.join('、') || '无'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">{combinedGod.tiaoHouDesc}</p>
                </div>

                {/* 五行补益评分 */}
                {wuxingMatch && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-green-800">🌿 五行补益评分</span>
                      <span className="text-2xl font-bold text-green-700">
                        {wuxingMatch.score}分
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {wuxingMatch.details.map((d: any) => (
                        <span
                          key={d.char}
                          className={`px-2 py-1 rounded text-xs ${
                            d.status === '喜用'
                              ? 'bg-green-100 text-green-700'
                              : d.status === '忌神'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {d.char}·{d.wuxing}·{d.status}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      名字中带有喜用神五行得+20分/字，带有忌神五行-15分/字
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 综合评分 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-serif">名字分析结果</h2>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-700">{analysis.overallScore}分</div>
                  <div className="text-sm text-gray-400">综合评分</div>
                </div>
              </div>

              {/* 三才配置 */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="font-bold mb-2">三才配置</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-white rounded text-sm">天才：{analysis.sanCai.tian}</span>
                  <span>→</span>
                  <span className="px-2 py-1 bg-white rounded text-sm">人才：{analysis.sanCai.ren}</span>
                  <span>→</span>
                  <span className="px-2 py-1 bg-white rounded text-sm">地才：{analysis.sanCai.di}</span>
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(analysis.sanCaiLuck.level)}`}>
                  {analysis.sanCaiLuck.level}
                </div>
                <p className="text-sm text-gray-600 mt-2">{analysis.sanCaiLuck.desc}</p>
              </div>

              {/* 五格剖象 */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { name: '天格', key: 'tianGe', desc: '祖先运' },
                  { name: '人格', key: 'renGe', desc: '主运' },
                  { name: '地格', key: 'diGe', desc: '前运' },
                  { name: '外格', key: 'waiGe', desc: '副运' },
                  { name: '总格', key: 'zongGe', desc: '后运' },
                ].map((item) => {
                  const grid = analysis.gridMeanings[item.key as keyof typeof analysis.gridMeanings]
                  return (
                    <div key={item.key} className="border border-gray-100 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">{item.name}·{item.desc}</div>
                      <div className="text-2xl font-bold text-blue-700">{grid.num}</div>
                      <div className="text-xs text-gray-400 mt-1">{grid.wuxing}</div>
                      <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-2 ${getLevelColor(grid.luck.level)}`}>
                        {grid.luck.level}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 leading-tight">{grid.luck.desc.slice(0, 20)}...</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 详细解析 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold font-serif mb-4">五格详解</h3>
              <div className="space-y-3">
                {[
                  { name: '天格', num: analysis.fiveGrid.tianGe, meaning: analysis.gridMeanings.tianGe, desc: '代表祖先运，影响不大，主要看数理吉凶。' },
                  { name: '人格', num: analysis.fiveGrid.renGe, meaning: analysis.gridMeanings.renGe, desc: '代表主运，影响一生性格、能力、运势，最重要的一格。' },
                  { name: '地格', num: analysis.fiveGrid.diGe, meaning: analysis.gridMeanings.diGe, desc: '代表前运（36岁前），影响青年时期运势。' },
                  { name: '外格', num: analysis.fiveGrid.waiGe, meaning: analysis.gridMeanings.waiGe, desc: '代表副运，影响人际关系、外部环境。' },
                  { name: '总格', num: analysis.fiveGrid.zongGe, meaning: analysis.gridMeanings.zongGe, desc: '代表后运（36岁后），影响中年晚年运势。' },
                ].map((item) => (
                  <div key={item.name} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="text-center min-w-[3rem]">
                      <div className="font-bold">{item.name}</div>
                      <div className="text-lg font-bold text-blue-700">{item.num}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(item.meaning.luck.level)}`}>
                          {item.meaning.luck.level}
                        </span>
                        <span className="text-xs text-gray-400">{item.meaning.wuxing}</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.meaning.luck.desc}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI起名结果占位 */}
        {mode === 'generate' && analysis && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold font-serif mb-4">AI起名推荐</h2>
            <p className="text-gray-500 text-center py-8">
              AI起名功能开发中，敬请期待...
            </p>
          </div>
        )}

        {/* 品牌名分析结果 */}
        {brandResult && mode === 'brand' && (
          <div className="space-y-6">
            {/* 综合评分 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-serif">品牌名分析结果</h2>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-700">{brandResult.brandScore}分</div>
                  <div className="text-sm text-gray-400">品牌综合评分</div>
                </div>
              </div>

              {/* 总格信息 */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm text-gray-500">总格数理：</span>
                  <span className="font-bold text-blue-700 text-lg">{brandResult.totalStrokes}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    brandResult.totalLuck.level === '吉' ? 'text-green-600 bg-green-50' :
                    brandResult.totalLuck.level === '凶' ? 'text-red-600 bg-red-50' :
                    'text-yellow-600 bg-yellow-50'
                  }`}>
                    {brandResult.totalLuck.level}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{brandResult.totalLuck.desc}</p>
              </div>

              {/* 单字拆解 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {brandResult.charDetails.map((c: any) => (
                  <div key={c.char} className="border border-gray-100 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-700">{c.char}</div>
                    <div className="text-xs text-gray-400 mt-1">{c.strokes}画 · {c.wuxing}</div>
                  </div>
                ))}
              </div>

              {/* 五行分布 */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="font-bold mb-2">五行分布</h3>
                <div className="flex gap-3 flex-wrap">
                  {(Object.entries(brandResult.wuxingDistribution) as [string, number][])
                    .filter(([_, count]) => count > 0)
                    .map(([wx, count]) => (
                      <span key={wx} className={`px-3 py-1 rounded-full text-sm ${
                        wx === '金' ? 'bg-amber-50 text-amber-700' :
                        wx === '木' ? 'bg-green-50 text-green-700' :
                        wx === '水' ? 'bg-blue-50 text-blue-700' :
                        wx === '火' ? 'bg-red-50 text-red-700' :
                        'bg-yellow-50 text-yellow-700'
                      }`}>
                        {wx} {count}个
                      </span>
                    ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">主导五行：<span className="font-bold text-blue-700">{brandResult.dominantWuxing}</span></p>
              </div>
            </div>

            {/* 商业维度分析 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold font-serif mb-4">商业维度评估</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'brand', title: '品牌传播', icon: '📢' },
                  { key: 'wealth', title: '财运聚集', icon: '💰' },
                  { key: 'industry', title: '行业适配', icon: '🏭' },
                  { key: 'growth', title: '发展前景', icon: '📈' },
                ].map((item) => {
                  const aspect = brandResult.businessAspects[item.key]
                  return (
                    <div key={item.key} className="bg-white rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.icon} {item.title}</span>
                        <span className="text-lg font-bold text-blue-700">{aspect.score}分</span>
                      </div>
                      <p className="text-xs text-gray-500">{aspect.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 建议 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold font-serif mb-3">命名建议</h3>
              <div className="space-y-2">
                {brandResult.recommendations.map((rec: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-white rounded-lg">
                    <span className="text-blue-600 font-bold">{i + 1}.</span>
                    <span className="text-sm text-gray-600">{rec}</span>
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
