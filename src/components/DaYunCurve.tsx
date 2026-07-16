'use client'

import { useRef, useEffect } from 'react'
import type { DaYunInfo } from '@/lib/bazi'
import { fortuneLevelColor } from '@/components/StarRating'

interface DaYunCurveProps {
  daYunList: DaYunInfo[]
  selectedDaYun: DaYunInfo | null
  onSelect: (dy: DaYunInfo) => void
}

/** 根据分数生成星级文本（实心+灰色空心） */
function getStarText(score: number): string {
  let full = 0
  if (score >= 85) full = 5
  else if (score >= 70) full = 4
  else if (score >= 55) full = 3
  else if (score >= 40) full = 2
  else full = 1
  return '★'.repeat(full) + '☆'.repeat(5 - full)
}

export function DaYunCurve({ daYunList, selectedDaYun, onSelect }: DaYunCurveProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  if (daYunList.length === 0) return null

  const width = 960
  const height = 340
  const padding = { top: 32, right: 60, bottom: 96, left: 60 }

  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // 数据点
  const points = daYunList.map((dy, i) => {
    const x = padding.left + (i / (daYunList.length - 1)) * chartWidth
    const y = padding.top + chartHeight - (dy.score / 100) * chartHeight
    return { x, y, dy }
  })

  // 找到当前节点
  const currentPoint = points.find((p) => p.dy.isCurrent)

  // 默认滚动到当前大运位置（居中）
  useEffect(() => {
    if (containerRef.current && currentPoint) {
      const container = containerRef.current
      const svgWidth = container.scrollWidth
      const nodeRatio = currentPoint.x / width
      const nodeScrollX = nodeRatio * svgWidth
      const scrollLeft = nodeScrollX - container.clientWidth / 2
      container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'auto' })
    }
  }, [daYunList])

  // 生成平滑曲线路径
  const getSmoothPath = (pts: typeof points) => {
    if (pts.length < 2) return ''

    const extended = [
      { ...pts[0], x: pts[0].x - (pts[1]?.x - pts[0].x || 0) },
      ...pts,
      { ...pts[pts.length - 1], x: pts[pts.length - 1].x + (pts[pts.length - 1].x - pts[pts.length - 2]?.x || 0) },
    ]

    let d = `M ${pts[0].x} ${pts[0].y}`

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = extended[i]
      const p1 = extended[i + 1]
      const p2 = extended[i + 2]
      const p3 = extended[i + 3]

      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }

    return d
  }

  const curvePath = getSmoothPath(points)
  const fillPath = `${curvePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`

  const currentYear = new Date().getFullYear()

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[660px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b6b4a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8b6b4a" stopOpacity="0.02" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

          {/* 标题 - 左上角 */}
        <text
          x={padding.left}
          y={18}
          textAnchor="start"
          className="text-[11px] font-bold"
          fill="rgba(255,255,255,0.35)"
        >
          人生运势起伏图
        </text>

        {/* 背景网格 */}
        {[20, 40, 60, 80].map((v) => {
          const y = padding.top + chartHeight - (v / 100) * chartHeight
          return (
            <g key={`grid-${v}`}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="text-[8px]"
                fill="rgba(255,255,255,0.25)"
              >
                {v}
              </text>
            </g>
          )
        })}

        {/* 填充区域 */}
        <path d={fillPath} fill="url(#curveFill)" />

        {/* 曲线 */}
        <path
          d={curvePath}
          fill="none"
          stroke="#8b6b4a"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* 数据点 + 大运卡片 */}
        {points.map((p) => {
          const isSelected = selectedDaYun?.index === p.dy.index
          const isCurrent = p.dy.isCurrent
          const isPast = p.dy.endYear < currentYear

          const color = fortuneLevelColor(p.dy.fortuneLevel)
          const radius = isSelected || isCurrent ? 13 : 10
          const starText = getStarText(p.dy.score)

          // 卡片样式 - 加大间距
          const cardW = 84
          const cardH = 78
          const cardY = padding.top + chartHeight + 14

          let cardBg = 'rgba(255,255,255,0.06)'
          let cardStroke = 'rgba(255,255,255,0.1)'
          let cardStrokeWidth = 1
          if (isPast) {
            cardBg = 'rgba(255,255,255,0.04)'
            cardStroke = 'rgba(255,255,255,0.08)'
          }
          if (isCurrent) {
            cardBg = 'rgba(255,255,255,0.06)'
            cardStroke = color
            cardStrokeWidth = 2
          }
          if (isSelected) {
            cardBg = 'rgba(201,169,110,0.1)'
            cardStroke = color
            cardStrokeWidth = 2.5
          }

          return (
            <g
              key={p.dy.index}
              className="cursor-pointer"
              onClick={() => onSelect(p.dy)}
            >
              {/* 外圈高亮 */}
              {(isSelected || isCurrent) && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={radius + 4}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  opacity="0.4"
                />
              )}

              {/* 透明点击区域 */}
              <circle
                cx={p.x}
                cy={p.y}
                r={radius + 10}
                fill="transparent"
                stroke="none"
                className="cursor-pointer"
              />

              {/* 节点圆 */}
              <circle
                cx={p.x}
                cy={p.y}
                r={radius}
                fill={isCurrent ? 'white' : color}
                stroke={color}
                strokeWidth={isCurrent ? 3 : 2}
                opacity={isPast ? 0.4 : 1}
              />

              {/* 仅当前标记 */}
              {isCurrent && (
                <text
                  x={p.x}
                  y={cardY - 4}
                  textAnchor="middle"
                  className="text-[9px] font-bold"
                  fill="#c9a96e"
                >
                  当前
                </text>
              )}

              {/* 大运卡片背景 */}
              <rect
                x={p.x - cardW / 2}
                y={cardY}
                width={cardW}
                height={cardH}
                rx={8}
                fill={cardBg}
                stroke={cardStroke}
                strokeWidth={cardStrokeWidth}
              />

              {/* 卡片内容 - 间距加大 */}
              <text
                x={p.x}
                y={cardY + 17}
                textAnchor="middle"
                className="text-[13px] font-bold"
                fill="rgba(255,255,255,0.85)"
              >
                {p.dy.ganZhi}
              </text>
              <text
                x={p.x}
                y={cardY + 32}
                textAnchor="middle"
                className="text-[9px]"
                fill="rgba(255,255,255,0.5)"
              >
                {p.dy.startYear}-{p.dy.endYear}
              </text>
              <text
                x={p.x}
                y={cardY + 45}
                textAnchor="middle"
                className="text-[9px]"
                fill="rgba(255,255,255,0.35)"
              >
                {p.dy.startAge}-{p.dy.endAge}岁
              </text>
              {/* 星级 - 实色+灰色空心 */}
              <text
                x={p.x}
                y={cardY + 64}
                textAnchor="middle"
                style={{ fontSize: 11 }}
              >
                <tspan fill="#c9a96e">
                  {starText.replace(/☆/g, '')}
                </tspan>
                <tspan fill="rgba(255,255,255,0.15)">
                  {'☆'.repeat((5 - (starText.match(/★/g)?.length || 0)))}
                </tspan>
              </text>

              {/* 透明点击区域覆盖整个卡片 */}
              <rect
                x={p.x - cardW / 2}
                y={cardY}
                width={cardW}
                height={cardH}
                fill="transparent"
                stroke="none"
                className="cursor-pointer"
              />
            </g>
          )
        })}

        {/* 当前年份竖线 */}
        {currentPoint && (
          <line
            x1={currentPoint.x}
            y1={padding.top}
            x2={currentPoint.x}
            y2={padding.top + chartHeight}
            stroke="#8b6b4a"
            strokeWidth="1"
            strokeDasharray="6 3"
            opacity="0.6"
          />
        )}
      </svg>
    </div>
  )
}
