'use client'

import { useRef, useEffect } from 'react'
import type { DaYunInfo } from '@/lib/bazi'
import { fortuneLevelColor } from '@/components/StarRating'

interface DaYunCurveProps {
  daYunList: DaYunInfo[]
  selectedDaYun: DaYunInfo | null
  onSelect: (dy: DaYunInfo) => void
}

/** 根据分数生成星级文本 */
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

  const width = 700
  const height = 240
  const padding = { top: 40, right: 30, bottom: 60, left: 30 }

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
      // 计算当前节点在 SVG 中的相对位置
      const svgWidth = container.scrollWidth
      const nodeRatio = currentPoint.x / width
      const nodeScrollX = nodeRatio * svgWidth
      // 居中滚动
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
        className="w-full min-w-[600px]"
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
                stroke="#f0ebe5"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] fill-ink-300"
              >
                {v}分
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

        {/* 数据点 + 节点 */}
        {points.map((p) => {
          const isSelected = selectedDaYun?.index === p.dy.index
          const isCurrent = p.dy.isCurrent
          const isPast = p.dy.endYear < currentYear

          const color = fortuneLevelColor(p.dy.fortuneLevel)
          // 增大节点：普通10px，选中/当前13px
          const radius = isSelected || isCurrent ? 13 : 10
          const starText = getStarText(p.dy.score)

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

              {/* 透明点击区域（比节点大很多，方便手机端触摸） */}
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
                fill={color}
                stroke="white"
                strokeWidth="2"
                opacity={isPast ? 0.4 : 1}
              />

              {/* 星级标签（仅选中和当前显示）—— 放在节点右上方，避免和"当前"重叠 */}
              {(isSelected || isCurrent) && (
                <text
                  x={p.x + radius + 6}
                  y={p.y - 4}
                  textAnchor="start"
                  className="text-[10px] fill-amber-500"
                  style={{ fontSize: 10 }}
                >
                  {starText}
                </text>
              )}

              {/* 大运名称标签 + 年份区间 + 年龄区间 */}
              <text
                x={p.x}
                y={padding.top + chartHeight + 16}
                textAnchor="middle"
                className="text-[11px] fill-fate-700 font-medium"
              >
                {p.dy.ganZhi}
              </text>
              <text
                x={p.x}
                y={padding.top + chartHeight + 30}
                textAnchor="middle"
                className="text-[10px] fill-ink-400"
              >
                {p.dy.startYear}-{p.dy.endYear}
              </text>
              <text
                x={p.x}
                y={padding.top + chartHeight + 42}
                textAnchor="middle"
                className="text-[10px] fill-ink-300"
              >
                {p.dy.startAge}-{p.dy.endAge}岁
              </text>

              {/* 当前标记 */}
              {isCurrent && (
                <text
                  x={p.x}
                  y={p.y - radius - 26}
                  textAnchor="middle"
                  className="text-[10px] fill-amber-600 font-bold"
                >
                  当前
                </text>
              )}

              {/* 选中标记 */}
              {isSelected && !isCurrent && (
                <text
                  x={p.x}
                  y={p.y - radius - 26}
                  textAnchor="middle"
                  className="text-[10px] fill-fate-600"
                >
                  选中
                </text>
              )}
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

        {/* 标题 */}
        <text
          x={width / 2}
          y={14}
          textAnchor="middle"
          className="text-[10px] fill-ink-300"
        >
          人生运势起伏图
        </text>
      </svg>
    </div>
  )
}
