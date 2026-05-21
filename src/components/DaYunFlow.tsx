'use client'

import { useState, useRef, useEffect } from 'react'
import { calculateDaYun, type DaYunInfo, type LiuNianInfo } from '@/lib/bazi'
import { getDaYunAiAnalysis, getLiuNianAiAnalysis } from '@/lib/analysis'

interface DaYunFlowProps {
  bazi: any // 完整八字数据（含 pillars, dayMaster, bodyStrength, pattern, combinedGod, cangGanDetail 等）
  gender: 'male' | 'female'
  name: string
  birthDate: string
}

export default function DaYunFlow({
  bazi,
  gender,
  name,
  birthDate,
}: DaYunFlowProps) {
  const { pillars, dayMaster } = bazi || {}
  const yearGan = pillars?.[0]?.gan || ''
  const monthGan = pillars?.[1]?.gan || ''
  const monthZhi = pillars?.[1]?.zhi || ''

  const [daYunList, setDaYunList] = useState<DaYunInfo[]>([])
  const [selectedDaYun, setSelectedDaYun] = useState<DaYunInfo | null>(null)
  const [selectedLiuNian, setSelectedLiuNian] = useState<LiuNianInfo | null>(null)
  const [daYunAiResult, setDaYunAiResult] = useState<Record<number, string>>({})
  const [liuNianAiResult, setLiuNianAiResult] = useState<Record<number, string>>({})
  const [loadingDaYunAi, setLoadingDaYunAi] = useState<number | null>(null)
  const [loadingLiuNianAi, setLoadingLiuNianAi] = useState<number | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef<HTMLDivElement>(null)

  // 计算大运数据
  useEffect(() => {
    if (!yearGan || !monthGan || !monthZhi || !dayMaster || !birthDate) return
    const list = calculateDaYun(yearGan, monthGan, monthZhi, dayMaster, gender, birthDate)
    setDaYunList(list)

    // 默认选中当前大运
    const current = list.find((d) => d.isCurrent)
    if (current) {
      setSelectedDaYun(current)
    }
  }, [yearGan, monthGan, monthZhi, dayMaster, gender, birthDate])

  // 滚动到当前大运
  useEffect(() => {
    if (currentRef.current && scrollRef.current) {
      const container = scrollRef.current
      const element = currentRef.current
      const scrollLeft = element.offsetLeft - container.clientWidth / 2 + element.clientWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [daYunList])

  if (daYunList.length === 0) return null

  const currentDaYun = daYunList.find((d) => d.isCurrent)
  const currentLiuNian = daYunList
    .flatMap((d) => d.years)
    .find((y) => y.isCurrent)

  const fortuneColor = (level: string) => {
    switch (level) {
      case '大吉': return 'text-red-600 bg-red-50 border-red-200'
      case '吉': return 'text-amber-600 bg-amber-50 border-amber-200'
      case '平': return 'text-blue-600 bg-blue-50 border-blue-200'
      case '凶': return 'text-slate-600 bg-slate-100 border-slate-300'
      case '大凶': return 'text-gray-600 bg-gray-100 border-gray-300'
      default: return 'text-ink-500 bg-fate-50 border-fate-200'
    }
  }

  const fortuneBarColor = (level: string) => {
    switch (level) {
      case '大吉': return 'bg-gradient-to-t from-red-500 to-red-400'
      case '吉': return 'bg-gradient-to-t from-amber-500 to-amber-400'
      case '平': return 'bg-gradient-to-t from-blue-400 to-blue-300'
      case '凶': return 'bg-gradient-to-t from-slate-500 to-slate-400'
      case '大凶': return 'bg-gradient-to-t from-gray-500 to-gray-400'
      default: return 'bg-gradient-to-t from-fate-400 to-fate-300'
    }
  }

  const scoreBarHeight = (score: number) => {
    return Math.max(20, Math.min(100, score))
  }

  // AI 大运解读
  const handleDaYunAi = async (daYun: DaYunInfo) => {
    if (daYunAiResult[daYun.index]) return
    setLoadingDaYunAi(daYun.index)
    setAiError(null)
    try {
      const result = await getDaYunAiAnalysis(bazi, daYun, name, gender)
      if (result && result.trim()) {
        setDaYunAiResult((prev) => ({ ...prev, [daYun.index]: result }))
      } else {
        setAiError('AI 解读返回为空，请检查 API 配置')
      }
    } catch (err: any) {
      setAiError('AI 解读失败：' + (err.message || '未知错误'))
    } finally {
      setLoadingDaYunAi(null)
    }
  }

  // AI 流年解读
  const handleLiuNianAi = async (liuNian: LiuNianInfo) => {
    if (!selectedDaYun) return
    if (liuNianAiResult[liuNian.year]) return
    setLoadingLiuNianAi(liuNian.year)
    setAiError(null)
    try {
      const daYunData = { ganZhi: selectedDaYun.ganZhi, gan: selectedDaYun.gan, zhi: selectedDaYun.zhi, shiShen: selectedDaYun.shiShen }
      const result = await getLiuNianAiAnalysis(bazi, daYunData, liuNian, name, gender)
      if (result && result.trim()) {
        setLiuNianAiResult((prev) => ({ ...prev, [liuNian.year]: result }))
      } else {
        setAiError('AI 解读返回为空，请检查 API 配置')
      }
    } catch (err: any) {
      setAiError('AI 解读失败：' + (err.message || '未知错误'))
    } finally {
      setLoadingLiuNianAi(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* 全局错误提示 */}
      {aiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center gap-2">
          <span>⚠️</span>
          <span>{aiError}</span>
          <button onClick={() => setAiError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* ===== 顶部当前定位卡 ===== */}
      {currentDaYun && (
        <div className="bg-gradient-to-br from-fate-700 to-fate-600 text-white rounded-xl p-5 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-fate-200 text-sm mb-1">您当前正处于</div>
              <div className="text-2xl font-bold">
                第{currentDaYun.index}步大运 · {currentDaYun.ganZhi}运
              </div>
              <div className="text-fate-200 text-sm mt-1">
                {currentDaYun.startYear} - {currentDaYun.endYear}（{currentDaYun.startAge}岁 - {currentDaYun.endAge}岁）
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${fortuneColor(currentDaYun.fortuneLevel)}`}>
                {currentDaYun.fortuneLevel}
              </div>
              <div className="text-fate-200 text-xs mt-1">还剩 {currentDaYun.endYear - new Date().getFullYear()} 年</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {currentDaYun.gan}天干 = {currentDaYun.shiShen}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {currentDaYun.yinYang}性 · {currentDaYun.wuXing}命
            </span>
            {currentDaYun.keywords.map((k, i) => (
              <span key={i} className="bg-white/10 px-3 py-1 rounded-full text-sm text-fate-100">
                {k}
              </span>
            ))}
          </div>

          {currentLiuNian && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center gap-3">
                <span className="text-sm">今年 {currentLiuNian.year} {currentLiuNian.ganZhi}年：</span>
                <span className={`text-sm font-bold`}>
                  {currentLiuNian.shiShen}当令 · {currentLiuNian.fortuneLevel}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== 大运时间轴 ===== */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-bold font-serif mb-4">一生大运走势</h3>

        {/* 横向可滚动时间轴 */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {daYunList.map((dy) => {
            const isSelected = selectedDaYun?.index === dy.index
            const isCurrent = dy.isCurrent
            const isPast = dy.endYear < new Date().getFullYear()

            return (
              <div
                key={dy.index}
                ref={isCurrent ? currentRef : null}
                onClick={() => {
                  setSelectedDaYun(dy)
                  setSelectedLiuNian(null)
                }}
                className={`flex-shrink-0 w-20 cursor-pointer transition-all duration-200 ${
                  isSelected ? 'scale-105' : 'opacity-80 hover:opacity-100'
                }`}
              >
                {/* 柱子高度表示运势强弱 */}
                <div className="flex flex-col items-center mb-2">
                  <div
                    className={`w-12 rounded-t-lg ${fortuneBarColor(dy.fortuneLevel)} transition-all duration-300`}
                    style={{
                      height: `${scoreBarHeight(dy.score)}px`,
                      opacity: isPast ? 0.5 : 1,
                    }}
                  />
                </div>

                {/* 干支标签 */}
                <div
                  className={`text-center py-2 rounded-lg border-2 transition-colors ${
                    isSelected
                      ? 'border-fate-500 bg-fate-50'
                      : isCurrent
                      ? 'border-fate-400 bg-fate-50'
                      : 'border-fate-100 bg-white'
                  }`}
                >
                  <div className="font-bold text-lg text-fate-700">{dy.ganZhi}</div>
                  <div className="text-xs text-ink-400">
                    {dy.startAge}-{dy.endAge}岁
                  </div>
                  {isCurrent && (
                    <div className="text-xs text-fate-600 font-bold mt-1">当前</div>
                  )}
                </div>

                {/* 年份 */}
                <div className="text-center text-xs text-ink-400 mt-1">
                  {dy.startYear}
                </div>
              </div>
            )
          })}
        </div>

        {/* 图例 */}
        <div className="flex items-center gap-4 mt-2 text-xs text-ink-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-400" />
            <span>大吉</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-amber-400" />
            <span>吉</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-400" />
            <span>平</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-slate-400" />
            <span>凶</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gray-400 opacity-50" />
            <span>已走过</span>
          </div>
        </div>
      </div>

      {/* ===== 大运详情面板 ===== */}
      {selectedDaYun && (
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold font-serif">
                {selectedDaYun.ganZhi}运（{selectedDaYun.startYear}-{selectedDaYun.endYear}）
              </h3>
              <p className="text-sm text-ink-500 mt-1">
                第{selectedDaYun.index}步大运 · {selectedDaYun.startAge}岁起运
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-block px-4 py-2 rounded-lg text-lg font-bold ${fortuneColor(selectedDaYun.fortuneLevel)}`}>
                {selectedDaYun.fortuneLevel}
              </div>
              <div className="text-sm font-bold text-fate-700 mt-1">运势评分 {selectedDaYun.score}分</div>
            </div>
          </div>

          {/* 大运十神解读 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-fate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-ink-500">大运天干</div>
              <div className="text-xl font-bold text-fate-700">{selectedDaYun.gan}</div>
              <div className="text-xs text-ink-400">{selectedDaYun.yinYang}性 · {selectedDaYun.wuXing}</div>
            </div>
            <div className="bg-fate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-ink-500">十神关系</div>
              <div className="text-lg font-bold text-fate-700">{selectedDaYun.shiShen}</div>
              <div className="text-xs text-ink-400">对日主{dayMaster}</div>
            </div>
            <div className="bg-fate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-ink-500">地支</div>
              <div className="text-xl font-bold text-fate-700">{selectedDaYun.zhi}</div>
              <div className="text-xs text-ink-400">藏干待展开</div>
            </div>
            <div className="bg-fate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-ink-500">运势标签</div>
              <div className="flex flex-wrap gap-1 justify-center mt-1">
                {selectedDaYun.keywords.slice(0, 2).map((k, i) => (
                  <span key={i} className="text-xs bg-fate-200 px-2 py-0.5 rounded text-fate-700">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI 深度解读按钮 */}
          <button
            onClick={() => handleDaYunAi(selectedDaYun)}
            disabled={loadingDaYunAi === selectedDaYun.index || !!daYunAiResult[selectedDaYun.index]}
            className="w-full bg-fate-600 hover:bg-fate-500 text-white py-3 rounded-lg font-medium transition-colors mb-4 disabled:opacity-50"
          >
            {loadingDaYunAi === selectedDaYun.index
              ? 'AI 正在深度解读...'
              : daYunAiResult[selectedDaYun.index]
              ? '✓ AI 解读已完成'
              : '🤖 AI 深度解读此大运'}
          </button>

          {/* AI 解读结果 */}
          {daYunAiResult[selectedDaYun.index] && (
            <div className="bg-fate-50 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-ink-700 mb-2">AI 大运深度解读</h4>
              <div className="prose max-w-none text-sm text-ink-700 whitespace-pre-line">
                {daYunAiResult[selectedDaYun.index]}
              </div>
            </div>
          )}

          {/* 流年明细表 */}
          <h4 className="font-bold text-ink-700 mb-3">此运十年流年</h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
            {selectedDaYun.years.map((ln) => (
              <div
                key={ln.year}
                onClick={() => setSelectedLiuNian(ln)}
                className={`cursor-pointer rounded-lg border-2 p-2 text-center transition-all ${
                  selectedLiuNian?.year === ln.year
                    ? 'border-fate-500 bg-fate-50 scale-105'
                    : ln.isCurrent
                    ? 'border-fate-400 bg-fate-50'
                    : 'border-fate-100 hover:border-fate-300'
                }`}
              >
                <div className="text-sm font-bold text-ink-700">{ln.year}</div>
                <div className="text-xs text-fate-600">{ln.ganZhi}</div>
                <div className={`text-xs font-bold mt-1 ${
                  ln.fortuneLevel === '大吉' ? 'text-red-500' :
                  ln.fortuneLevel === '吉' ? 'text-amber-500' :
                  ln.fortuneLevel === '平' ? 'text-blue-500' :
                  ln.fortuneLevel === '凶' ? 'text-slate-500' :
                  'text-gray-500'
                }`}>
                  {ln.fortuneLevel}
                </div>
                {ln.isCurrent && (
                  <div className="text-xs text-fate-600 mt-0.5">今年</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== 流年详情弹窗 ===== */}
      {selectedLiuNian && (
        <div className="bg-white rounded-lg shadow-sm p-5 border-2 border-fate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-serif">
              {selectedLiuNian.year}年 {selectedLiuNian.ganZhi} · 您的专属流年
            </h3>
            <button
              onClick={() => setSelectedLiuNian(null)}
              className="text-ink-400 hover:text-ink-600 text-xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-fate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-ink-500">流年干支</div>
              <div className="text-2xl font-bold text-fate-700">{selectedLiuNian.ganZhi}</div>
            </div>
            <div className="bg-fate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-ink-500">十神</div>
              <div className="text-lg font-bold text-fate-700">{selectedLiuNian.shiShen}</div>
            </div>
            <div className="bg-fate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-ink-500">五行</div>
              <div className="text-lg font-bold text-fate-700">{selectedLiuNian.wuXing}</div>
            </div>
            <div className="bg-fate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-ink-500">运势等级</div>
              <div className={`text-lg font-bold ${
                selectedLiuNian.fortuneLevel === '大吉' ? 'text-red-600' :
                selectedLiuNian.fortuneLevel === '吉' ? 'text-amber-600' :
                selectedLiuNian.fortuneLevel === '平' ? 'text-blue-600' :
                selectedLiuNian.fortuneLevel === '凶' ? 'text-slate-600' :
                'text-gray-600'
              }`}>
                {selectedLiuNian.fortuneLevel}
              </div>
              <div className="text-xs text-ink-400">评分 {selectedLiuNian.score}分</div>
            </div>
          </div>

          {/* 年度主题解读 */}
          <div className="bg-fate-50 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-ink-700 mb-2">年度主题</h4>
            <p className="text-sm text-ink-600">
              {selectedLiuNian.shiShen === '正官' && '正官流年，事业心增强，适合争取晋升、承担责任。'}
              {selectedLiuNian.shiShen === '七杀' && '七杀流年，压力与挑战并存，适合攻坚克难，但要注意健康。'}
              {selectedLiuNian.shiShen === '正印' && '正印流年，贵人运旺，适合学习深造、考取证书。'}
              {selectedLiuNian.shiShen === '偏印' && '偏印流年，灵感涌现，适合创意工作，但注意人际关系。'}
              {selectedLiuNian.shiShen === '正财' && '正财流年，财运稳定，适合稳健理财、积累财富。'}
              {selectedLiuNian.shiShen === '偏财' && '偏财流年，偏财运佳，有意外收获，但不宜冒险投机。'}
              {selectedLiuNian.shiShen === '食神' && '食神流年，才华绽放，适合创作表达、享受生活。'}
              {selectedLiuNian.shiShen === '伤官' && '伤官流年，思维活跃，适合创新突破，但注意言辞。'}
              {selectedLiuNian.shiShen === '比肩' && '比肩流年，合作增多，适合团队协作，注意竞争。'}
              {selectedLiuNian.shiShen === '劫财' && '劫财运年，竞争激烈，注意财物保管，避免借贷。'}
            </p>
          </div>

          {/* 关键月份提醒 */}
          <div className="mb-4">
            <h4 className="font-bold text-ink-700 mb-3">关键月份提醒</h4>
            <div className="space-y-2">
              {selectedLiuNian.monthHighlights.map((mh, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    mh.level === '吉' ? 'bg-green-50' :
                    mh.level === '凶' ? 'bg-red-50' :
                    'bg-fate-50'
                  }`}
                >
                  <span className={`text-sm font-bold ${
                    mh.level === '吉' ? 'text-green-600' :
                    mh.level === '凶' ? 'text-red-600' :
                    'text-ink-500'
                  }`}>
                    {mh.level === '吉' ? '✓' : mh.level === '凶' ? '⚠' : '—'}
                  </span>
                  <span className="text-sm text-ink-700">{mh.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI 深度解读按钮 */}
          <button
            onClick={() => handleLiuNianAi(selectedLiuNian)}
            disabled={loadingLiuNianAi === selectedLiuNian.year || !!liuNianAiResult[selectedLiuNian.year]}
            className="w-full bg-fate-600 hover:bg-fate-500 text-white py-3 rounded-lg font-medium transition-colors mb-4 disabled:opacity-50"
          >
            {loadingLiuNianAi === selectedLiuNian.year
              ? 'AI 正在深度解读...'
              : liuNianAiResult[selectedLiuNian.year]
              ? '✓ AI 解读已完成'
              : '🤖 AI 深度解读此流年'}
          </button>

          {/* AI 解读结果 */}
          {liuNianAiResult[selectedLiuNian.year] && (
            <div className="bg-fate-50 rounded-lg p-4">
              <h4 className="font-bold text-ink-700 mb-2">AI 流年深度解读</h4>
              <div className="prose max-w-none text-sm text-ink-700 whitespace-pre-line">
                {liuNianAiResult[selectedLiuNian.year]}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
