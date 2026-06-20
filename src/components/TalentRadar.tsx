'use client'

import React from 'react'

interface RadarData {
  label: string
  fullLabel: string
  value: number
  color: string
}

interface TalentRadarProps {
  data: RadarData[]
  size?: number
}

const LEVEL_COLORS: Record<string, string> = {
  '极高': '#F59E0B',
  '高': '#10B981',
  '中等': '#3B82F6',
  '一般': '#6B7280',
  '较弱': '#9CA3AF',
}

export default function TalentRadar({ data, size = 320 }: TalentRadarProps) {
  const padding = 40
  const center = size / 2
  const radius = (size - padding * 2) / 2
  const levels = 5 // 5个同心圆层级

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 8 - Math.PI / 2
    const r = (value / 100) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  const getLabelPoint = (index: number, dist: number) => {
    const angle = (Math.PI * 2 * index) / 8 - Math.PI / 2
    return {
      x: center + dist * Math.cos(angle),
      y: center + dist * Math.sin(angle),
    }
  }

  // 构建数据多边形路径
  const polygonPoints = data
    .map((d, i) => {
      const p = getPoint(i, d.value)
      return `${p.x},${p.y}`
    })
    .join(' ')

  // 渐变填充颜色
  const fillGradient = 'url(#radarGradient)'

  return (
    <div className="relative flex justify-center">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.25)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.15)" />
            <stop offset="100%" stopColor="rgba(124, 111, 174, 0.1)" />
          </radialGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 背景同心圆 */}
        {[...Array(levels)].map((_, i) => {
          const r = ((i + 1) / levels) * radius
          return (
            <g key={`level-${i}`}>
              <circle
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="rgba(201,147,90,0.08)"
                strokeWidth="1"
                strokeDasharray={i === levels - 1 ? 'none' : '3,3'}
              />
              {/* 层级标注 */}
              <text
                x={center + 4}
                y={center - r + 2}
                fill="rgba(201,147,90,0.25)"
                fontSize="9"
                fontFamily="Georgia, serif"
              >
                {(i + 1) * 20}
              </text>
            </g>
          )
        })}

        {/* 轴线 */}
        {data.map((_, i) => {
          const end = getPoint(i, 100)
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="rgba(201,147,90,0.06)"
              strokeWidth="1"
            />
          )
        })}

        {/* 数据填充区域 */}
        <polygon
          points={polygonPoints}
          fill={fillGradient}
          stroke="url(#lineGradient)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          filter="url(#glow)"
          className="transition-all duration-700 ease-out"
        />

        {/* 数据点 */}
        {data.map((d, i) => {
          const p = getPoint(i, d.value)
          return (
            <g key={`point-${i}`}>
              {/* 外圈光晕 */}
              <circle
                cx={p.x}
                cy={p.y}
                r="6"
                fill={d.color}
                opacity="0.2"
                className="animate-pulse"
              />
              {/* 核心点 */}
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill={d.color}
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="1.5"
              />
              {/* 数值标注 */}
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fill={d.color}
                fontSize="11"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                {d.value}
              </text>
            </g>
          )
        })}

        {/* 维度标签 */}
        {data.map((d, i) => {
          const lp = getLabelPoint(i, radius + 32)
          const isTop = i === 0
          const isBottom = i === 4
          const icon = getIconForLabel(d.label)
          const dyText = isTop ? -10 : isBottom ? 18 : 4
          const dyIcon = isTop ? -26 : isBottom ? 2 : -12
          return (
            <g key={`label-${i}`}>
              {/* 图标 */}
              <text
                x={lp.x}
                y={lp.y + dyIcon}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="15"
              >
                {icon}
              </text>
              {/* 文字 */}
              <text
                x={lp.x}
                y={lp.y + dyText}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.75)"
                fontSize="12"
                fontWeight="500"
                fontFamily="system-ui, sans-serif"
              >
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function getIconForLabel(label: string): string {
  const icons: Record<string, string> = {
    '语言': '文',
    '逻辑数学': '数',
    '空间': '空',
    '身体动觉': '体',
    '音乐': '音',
    '人际': '人',
    '自省': '省',
    '自然': '自',
  }
  return icons[label] || '●'
}

// 根据分数获取颜色
export function getScoreColor(score: number): string {
  if (score >= 80) return '#F59E0B'  // 极高 - 金色
  if (score >= 65) return '#10B981'  // 高 - 绿色
  if (score >= 50) return '#3B82F6'  // 中等 - 蓝色
  if (score >= 35) return '#6B7280'  // 一般 - 灰色
  return '#9CA3AF'                    // 较弱 - 浅灰
}

export function getLevelFromScore(score: number): string {
  if (score >= 80) return '极高'
  if (score >= 65) return '高'
  if (score >= 50) return '中等'
  if (score >= 35) return '一般'
  return '较弱'
}
