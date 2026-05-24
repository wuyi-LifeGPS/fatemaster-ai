'use client'

import { useState, useRef, useEffect } from 'react'
import { calculateDaYun, type DaYunInfo, type LiuNianInfo } from '@/lib/bazi'
import { getDaYunAiAnalysis, getLiuNianAiAnalysis } from '@/lib/analysis'
import {
  getDaYunStageLabel,
  getDaYunHumanSummary,
  getDaYunOneLiner,
  getDaYunAdvice,
  getShiShenSimpleMeaning,
  getLiuNianHumanSummary,
  getLiuNianOneLiner,
} from '@/lib/dayun-simple'
import { StarRating } from '@/components/StarRating'
import { DaYunCurve } from '@/components/DaYunCurve'

interface DaYunFlowProps {
  bazi: any
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
  const [viewMode, setViewMode] = useState<'simple' | 'pro'>('simple')
  const [showAllLiuNian, setShowAllLiuNian] = useState(false)

  const [daYunAiResult, setDaYunAiResult] = useState<Record<number, string>>({})
  const [liuNianAiResult, setLiuNianAiResult] = useState<Record<number, string>>({})
  const [loadingDaYunAi, setLoadingDaYunAi] = useState<number | null>(null)
  const [loadingLiuNianAi, setLoadingLiuNianAi] = useState<number | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)

  const detailRef = useRef<HTMLDivElement>(null)

  // 计算大运数据
  useEffect(() => {
    if (!yearGan || !monthGan || !monthZhi || !dayMaster || !birthDate) return
    const list = calculateDaYun(
      yearGan,
      monthGan,
      monthZhi,
      dayMaster,
      gender,
      birthDate,
      pillars
    )
    setDaYunList(list)
    const current = list.find((d) => d.isCurrent)
    if (current) setSelectedDaYun(current)
  }, [yearGan, monthGan, monthZhi, dayMaster, gender, birthDate])

  if (daYunList.length === 0) return null

  const currentDaYun = daYunList.find((d) => d.isCurrent)
  const currentLiuNian = daYunList
    .flatMap((d) => d.years)
    .find((y) => y.isCurrent)

  const fortuneColor = (level: string) => {
    switch (level) {
      case '大吉':
        return 'text-red-600 bg-red-50 border-red-200'
      case '吉':
        return 'text-amber-600 bg-amber-50 border-amber-200'
      case '平':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case '凶':
        return 'text-slate-600 bg-slate-100 border-slate-300'
      case '大凶':
        return 'text-gray-600 bg-gray-100 border-gray-300'
      default:
        return 'text-ink-500 bg-fate-50 border-fate-200'
    }
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
      const daYunData = {
        ganZhi: selectedDaYun.ganZhi,
        gan: selectedDaYun.gan,
        zhi: selectedDaYun.zhi,
        shiShen: selectedDaYun.shiShen,
      }
      const result = await getLiuNianAiAnalysis(
        bazi,
        daYunData,
        liuNian,
        name,
        gender
      )
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

  // 点击大运后滚动到详情
  const handleSelectDaYun = (dy: DaYunInfo) => {
    setSelectedDaYun(dy)
    setSelectedLiuNian(null)
    setShowAllLiuNian(false)
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="space-y-6">
      {/* 全局错误提示 */}
      {aiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center gap-2">
          <span>⚠️</span>
          <span>{aiError}</span>
          <button
            onClick={() => setAiError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* ===== 顶部当前定位卡（人话版为主） ===== */}
      {currentDaYun && (
        <div className="bg-gradient-to-br from-fate-700 to-fate-600 text-white rounded-xl p-5 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-fate-200 text-sm mb-1">
                您当前正处于 · 第{currentDaYun.index}步大运
              </div>
              <div className="text-2xl font-bold">
                {viewMode === 'simple'
                  ? `${getDaYunStageLabel(currentDaYun.index, currentDaYun.fortuneLevel)} · ${currentDaYun.ganZhi}运`
                  : `第${currentDaYun.index}步大运 · ${currentDaYun.ganZhi}运`}
              </div>
              <div className="text-fate-200 text-sm mt-1">
                {currentDaYun.startYear} - {currentDaYun.endYear}（
                {currentDaYun.startAge}岁 - {currentDaYun.endAge}岁）
              </div>

              {/* 人话版一句话结论 */}
              {viewMode === 'simple' && (
                <div className="mt-3 text-sm text-white/90 leading-relaxed">
                  {getDaYunHumanSummary(currentDaYun)}
                </div>
              )}
            </div>
            <div className="text-right ml-4 flex flex-col items-end gap-2">
              <div
                className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${fortuneColor(
                  currentDaYun.fortuneLevel
                )}`}
              >
                {currentDaYun.fortuneLevel}
              </div>
              <div className="text-fate-200 text-xs">
                还剩 {currentDaYun.endYear - new Date().getFullYear()} 年
              </div>
              <div className="flex items-center gap-1">
                <StarRating score={currentDaYun.score} size="sm" showLabel={false} />
                <span className="text-xs text-fate-200 ml-1">运势评分</span>
              </div>
            </div>
          </div>

          {/* 关键词标签 + 全局切换 */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {currentDaYun.keywords.map((k, i) => (
                <span
                  key={i}
                  className="bg-white/20 px-3 py-1 rounded-full text-sm text-fate-100"
                >
                  {k}
                </span>
              ))}
            </div>
            {/* 全局版本切换 - 更显眼的开关 */}
            <button
              onClick={() => setViewMode(viewMode === 'simple' ? 'pro' : 'simple')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                viewMode === 'simple'
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-fate-200 text-fate-700 hover:bg-fate-300'
              }`}
            >
              <span className="text-base">{viewMode === 'simple' ? '👤' : '🔮'}</span>
              <span>{viewMode === 'simple' ? '简易版' : '专业版'}</span>
              <span className="text-[10px] opacity-70">切换</span>
            </button>
          </div>

          {/* 今年流年速览 */}
          {currentLiuNian && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm">
                    今年 {currentLiuNian.year} {currentLiuNian.ganZhi}年：
                  </span>
                  <span className="text-sm font-bold">
                    {viewMode === 'simple'
                      ? getLiuNianHumanSummary(currentLiuNian)
                      : `${currentLiuNian.shiShen}当令 · ${currentLiuNian.fortuneLevel}`}
                  </span>
                </div>
                <span className="text-xs text-fate-200">
                  {getLiuNianOneLiner(currentLiuNian)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== 一生大运走势 —— 曲线图 ===== */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <DaYunCurve
          daYunList={daYunList}
          selectedDaYun={selectedDaYun}
          onSelect={handleSelectDaYun}
        />

        {/* 图例 */}
        <div className="flex items-center gap-4 mt-3 text-xs text-ink-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>大吉</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>吉</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>平</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-slate-500" />
            <span>凶</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-500 opacity-50" />
            <span>已走过</span>
          </div>
        </div>
      </div>

      {/* ===== 大运详情面板 - 增加头部标签栏 ===== */}
      {selectedDaYun && (
        <div ref={detailRef} className="bg-white rounded-lg shadow-sm border border-fate-100">
          {/* 顶部标签栏 */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-fate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-fate-700">
                {selectedDaYun.ganZhi}运
              </span>
              <span className="text-xs text-ink-400">
                {selectedDaYun.startYear}-{selectedDaYun.endYear}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-fate-50 rounded-full p-1">              <button
                onClick={() => setViewMode('simple')}
                className={`text-xs px-3 py-1 rounded-full transition-all ${
                  viewMode === 'simple'
                    ? 'bg-white text-fate-700 shadow-sm font-bold'
                    : 'text-ink-400 hover:text-ink-600'
                }`}
              >
                👤 简易
              </button>
              <button
                onClick={() => setViewMode('pro')}
                className={`text-xs px-3 py-1 rounded-full transition-all ${
                  viewMode === 'pro'
                    ? 'bg-white text-fate-700 shadow-sm font-bold'
                    : 'text-ink-400 hover:text-ink-600'
                }`}
              >
                🔮 专业
              </button>
            </div>
          </div>

          <div className="p-5">
          {/* 标题 + 运势等级 */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-fate-100">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold font-serif">
                  {viewMode === 'simple'
                    ? `${getDaYunStageLabel(selectedDaYun.index, selectedDaYun.fortuneLevel)}`
                    : `${selectedDaYun.ganZhi}运`}
                </h3>
                <span className="text-sm text-ink-400">
                  {selectedDaYun.startYear}-{selectedDaYun.endYear}
                </span>
              </div>
              <p className="text-sm text-ink-500">
                第{selectedDaYun.index}步大运 · {selectedDaYun.startAge}岁起运
                {viewMode === 'simple' && (
                  <span className="ml-2 text-fate-600">
                    {selectedDaYun.ganZhi} · {selectedDaYun.shiShen}
                  </span>
                )}
              </p>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <div
                className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${fortuneColor(
                  selectedDaYun.fortuneLevel
                )}`}
              >
                {selectedDaYun.fortuneLevel}
              </div>
              <div className="flex items-center gap-1">
                <StarRating score={selectedDaYun.score} size="sm" showLabel={false} />
                <span className="text-xs text-ink-400">运势评分</span>
              </div>
            </div>
          </div>

          {/* 一句话结论 */}
          {viewMode === 'simple' && (
            <div className="bg-fate-50 border border-fate-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-ink-700 font-medium">
                {getDaYunHumanSummary(selectedDaYun)}
              </p>
              <p className="text-xs text-ink-500 mt-2">
                {getDaYunOneLiner(selectedDaYun)}
              </p>
            </div>
          )}

          {/* 人话版：四宫格建议 - 优化视觉 */}
          {viewMode === 'simple' && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {(() => {
                const advice = getDaYunAdvice(selectedDaYun)
                const items = [
                  { icon: '💼', title: '事业', key: 'career', color: 'border-l-4 border-l-blue-400' },
                  { icon: '💰', title: '财运', key: 'wealth', color: 'border-l-4 border-l-amber-400' },
                  { icon: '❤️', title: '感情', key: 'love', color: 'border-l-4 border-l-red-400' },
                  { icon: '🏥', title: '健康', key: 'health', color: 'border-l-4 border-l-green-400' },
                ]
                return items.map((item) => (
                  <div
                    key={item.key}
                    className={`bg-white border border-fate-100 rounded-lg p-3 shadow-sm ${item.color}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-xs font-bold text-ink-500">{item.title}</span>
                    </div>
                    <div className="text-sm font-medium text-ink-700">
                      {advice[item.key as 'career' | 'wealth' | 'love' | 'health']}
                    </div>
                  </div>
                ))
              })()}
            </div>
          )}

          {/* 专业版：命理术语卡片 - 优化视觉 */}
          {viewMode === 'pro' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-white border border-fate-200 rounded-lg p-3 text-center shadow-sm">
                <div className="text-xs text-ink-400 mb-1">大运天干</div>
                <div className="text-2xl font-bold text-fate-700">{selectedDaYun.gan}</div>
                <div className="text-xs text-ink-400 mt-1">{selectedDaYun.yinYang} · {selectedDaYun.wuXing}</div>
              </div>
              <div className="bg-white border border-fate-200 rounded-lg p-3 text-center shadow-sm">
                <div className="text-xs text-ink-400 mb-1">十神关系</div>
                <div className="text-lg font-bold text-fate-700">{selectedDaYun.shiShen}</div>
                <div className="text-xs text-ink-400 mt-1">对日主{dayMaster}</div>
              </div>
              <div className="bg-white border border-fate-200 rounded-lg p-3 text-center shadow-sm">
                <div className="text-xs text-ink-400 mb-1">地支</div>
                <div className="text-2xl font-bold text-fate-700">{selectedDaYun.zhi}</div>
                <div className="text-xs text-ink-400 mt-1">藏干待展开</div>
              </div>
              <div className="bg-white border border-fate-200 rounded-lg p-3 text-center shadow-sm">
                <div className="text-xs text-ink-400 mb-1">运势标签</div>
                <div className="flex flex-wrap gap-1 justify-center mt-1">
                  {selectedDaYun.keywords.slice(0, 2).map((k, i) => (
                    <span
                      key={i}
                      className="text-xs bg-fate-100 px-2 py-0.5 rounded text-fate-700"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 模式切换 - 改成更明显的标签 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                viewMode === 'simple' ? 'bg-fate-600 text-white' : 'bg-fate-100 text-fate-500'
              }`}>
                👤 简易版
              </span>
              <button
                onClick={() => setViewMode(viewMode === 'simple' ? 'pro' : 'simple')}
                className="relative w-10 h-5 bg-fate-200 rounded-full transition-colors hover:bg-fate-300"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    viewMode === 'pro' ? 'translate-x-5' : ''
                  }`}
                />
              </button>
              <span className={`text-xs px-2 py-1 rounded-full ${
                viewMode === 'pro' ? 'bg-fate-600 text-white' : 'bg-fate-100 text-fate-500'
              }`}>
                🔮 专业版
              </span>
            </div>
          </div>

          {/* AI 深度解读按钮 */}
          <button
            onClick={() => handleDaYunAi(selectedDaYun)}
            disabled={
              loadingDaYunAi === selectedDaYun.index ||
              !!daYunAiResult[selectedDaYun.index]
            }
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

          {/* 流年：默认今年+明年，可展开 */}
          <h4 className="font-bold text-ink-700 mb-3">此运流年</h4>

          {/* 优先展示今年和明年 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
            {selectedDaYun.years
              .filter(
                (ln) =>
                  ln.isCurrent ||
                  ln.year === new Date().getFullYear() + 1 ||
                  showAllLiuNian
              )
              .map((ln) => (
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
                  <div className="text-sm font-bold text-ink-700">
                    {ln.year}
                  </div>
                  <div className="text-xs text-fate-600">
                    {viewMode === 'simple'
                      ? getShiShenSimpleMeaning(ln.shiShen)
                      : ln.ganZhi}
                  </div>
                  <div
                    className={`text-xs font-bold mt-1 ${
                      ln.fortuneLevel === '大吉'
                        ? 'text-red-500'
                        : ln.fortuneLevel === '吉'
                        ? 'text-amber-500'
                        : ln.fortuneLevel === '平'
                        ? 'text-blue-500'
                        : ln.fortuneLevel === '凶'
                        ? 'text-slate-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {ln.fortuneLevel}
                  </div>
                  {/* 流年五星评分 */}
                  <div className="mt-1 flex justify-center">
                    <StarRating score={ln.score} size="sm" showLabel={false} />
                  </div>
                  {ln.isCurrent && (
                    <div className="text-xs text-fate-600 mt-0.5">今年</div>
                  )}
                  {ln.year === new Date().getFullYear() + 1 && (
                    <div className="text-xs text-fate-500 mt-0.5">明年</div>
                  )}
                </div>
              ))}
          </div>

          {/* 展开/收起按钮 */}
          <button
            onClick={() => setShowAllLiuNian(!showAllLiuNian)}
            className="w-full text-center text-sm text-fate-600 hover:text-fate-800 py-2 border border-fate-200 rounded-lg transition-colors"
          >
            {showAllLiuNian
              ? '收起 · 只看今年明年'
              : `查看完整十年流年 (${selectedDaYun.years.length}年) →`}
          </button>
        </div>
        </div>
      )}

      {/* ===== 流年详情弹窗 ===== */}
      {selectedLiuNian && (
        <div className="bg-white rounded-lg shadow-sm p-5 border-2 border-fate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-serif">
              {selectedLiuNian.year}年 · {selectedLiuNian.ganZhi}
            </h3>
            <button
              onClick={() => setSelectedLiuNian(null)}
              className="text-ink-400 hover:text-ink-600 text-xl"
            >
              ✕
            </button>
          </div>

          {/* 人话版一句话 */}
          {viewMode === 'simple' && (
            <div className="bg-fate-50 border border-fate-200 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-ink-700">
                {getLiuNianHumanSummary(selectedLiuNian)}
              </p>
              <p className="text-xs text-ink-500 mt-1">
                {getLiuNianOneLiner(selectedLiuNian)}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-fate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-ink-500">
                {viewMode === 'simple' ? '年度主题' : '流年干支'}
              </div>
              <div className="text-2xl font-bold text-fate-700">
                {viewMode === 'simple'
                  ? getShiShenSimpleMeaning(selectedLiuNian.shiShen)
                  : selectedLiuNian.ganZhi}
              </div>
            </div>
            <div className="bg-fate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-ink-500">
                {viewMode === 'simple' ? '运势提示' : '十神'}
              </div>
              <div className="text-lg font-bold text-fate-700">
                {viewMode === 'simple'
                  ? selectedLiuNian.fortuneLevel === '大吉'
                    ? '大展宏图'
                    : selectedLiuNian.fortuneLevel === '吉'
                    ? '稳步前进'
                    : selectedLiuNian.fortuneLevel === '平'
                    ? '保持节奏'
                    : selectedLiuNian.fortuneLevel === '凶'
                    ? '谨慎行事'
                    : '守成为主'
                  : selectedLiuNian.shiShen}
              </div>
            </div>
            <div className="bg-fate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-ink-500">
                {viewMode === 'simple' ? '年龄' : '五行'}
              </div>
              <div className="text-lg font-bold text-fate-700">
                {viewMode === 'simple'
                  ? `${selectedLiuNian.age}岁`
                  : selectedLiuNian.wuXing}
              </div>
            </div>
            <div className="bg-fate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-ink-500">运势等级</div>
              <div
                className={`text-lg font-bold ${
                  selectedLiuNian.fortuneLevel === '大吉'
                    ? 'text-red-600'
                    : selectedLiuNian.fortuneLevel === '吉'
                    ? 'text-amber-600'
                    : selectedLiuNian.fortuneLevel === '平'
                    ? 'text-blue-600'
                    : selectedLiuNian.fortuneLevel === '凶'
                    ? 'text-slate-600'
                    : 'text-gray-600'
                }`}
              >
                {selectedLiuNian.fortuneLevel}
              </div>
              {/* 五星评分替代数字 */}
              <div className="mt-1 flex justify-center">
                <StarRating score={selectedLiuNian.score} size="sm" showLabel={false} />
              </div>
            </div>
          </div>

          {/* 年度主题解读（专业版才显示详细十神描述） */}
          {viewMode === 'pro' && (
            <div className="bg-fate-50 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-ink-700 mb-2">年度主题</h4>
              <p className="text-sm text-ink-600">
                {selectedLiuNian.shiShen === '正官' &&
                  '正官流年，事业心增强，适合争取晋升、承担责任。'}
                {selectedLiuNian.shiShen === '七杀' &&
                  '七杀流年，压力与挑战并存，适合攻坚克难，但要注意健康。'}
                {selectedLiuNian.shiShen === '正印' &&
                  '正印流年，贵人运旺，适合学习深造、考取证书。'}
                {selectedLiuNian.shiShen === '偏印' &&
                  '偏印流年，灵感涌现，适合创意工作，但注意人际关系。'}
                {selectedLiuNian.shiShen === '正财' &&
                  '正财流年，财运稳定，适合稳健理财、积累财富。'}
                {selectedLiuNian.shiShen === '偏财' &&
                  '偏财流年，偏财运佳，有意外收获，但不宜冒险投机。'}
                {selectedLiuNian.shiShen === '食神' &&
                  '食神流年，才华绽放，适合创作表达、享受生活。'}
                {selectedLiuNian.shiShen === '伤官' &&
                  '伤官流年，思维活跃，适合创新突破，但注意言辞。'}
                {selectedLiuNian.shiShen === '比肩' &&
                  '比肩流年，合作增多，适合团队协作，注意竞争。'}
                {selectedLiuNian.shiShen === '劫财' &&
                  '劫财运年，竞争激烈，注意财物保管，避免借贷。'}
              </p>
            </div>
          )}

          {/* 关键月份提醒 */}
          <div className="mb-4">
            <h4 className="font-bold text-ink-700 mb-3">关键月份提醒</h4>
            <div className="space-y-2">
              {selectedLiuNian.monthHighlights.map((mh, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    mh.level === '吉'
                      ? 'bg-green-50'
                      : mh.level === '凶'
                      ? 'bg-red-50'
                      : 'bg-fate-50'
                  }`}
                >
                  <span
                    className={`text-sm font-bold ${
                      mh.level === '吉'
                        ? 'text-green-600'
                        : mh.level === '凶'
                        ? 'text-red-600'
                        : 'text-ink-500'
                    }`}
                  >
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
            disabled={
              loadingLiuNianAi === selectedLiuNian.year ||
              !!liuNianAiResult[selectedLiuNian.year]
            }
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
