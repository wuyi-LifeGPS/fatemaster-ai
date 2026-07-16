'use client'

import { useMemo } from 'react'

const WEEKLY_ASPECTS = [
  { aspect: '事业', score: 85, trend: 'up', advice: '本周工作进展顺利，有机会获得领导认可。' },
  { aspect: '财运', score: 72, trend: 'stable', advice: '财运平稳，不宜大额投资，保守理财为宜。' },
  { aspect: '感情', score: 90, trend: 'up', advice: '桃花运旺盛，单身者有望遇到心仪对象。' },
  { aspect: '健康', score: 68, trend: 'down', advice: '注意休息，避免熬夜，适当运动增强体质。' },
  { aspect: '人际', score: 78, trend: 'stable', advice: '人际关系和谐，适合拓展社交圈子。' },
  { aspect: '学习', score: 82, trend: 'up', advice: '学习效率高，适合充电提升自己。' },
]

function getScoreColor(score: number): string {
  if (score >= 80) return '#4ade80'
  if (score >= 60) return '#fbbf24'
  return '#f87171'
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up') return <span className="text-green-400 text-xs">↗️</span>
  if (trend === 'down') return <span className="text-red-400 text-xs">↘️</span>
  return <span className="text-yellow-400 text-xs">➡️</span>
}

export default function WeeklyFortuneSummary() {
  const weekData = useMemo(() => WEEKLY_ASPECTS, [])
  const avgScore = Math.round(weekData.reduce((sum, item) => sum + item.score, 0) / weekData.length)

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h3 className="text-gold text-sm font-semibold">本周运势</h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold" style={{ color: getScoreColor(avgScore) }}>
            {avgScore}
          </span>
          <span className="text-xs text-moonly-muted">综合分</span>
        </div>
      </div>

      {/* Score bars */}
      <div className="space-y-3 mb-4">
        {weekData.map(item => (
          <div key={item.aspect}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/70">{item.aspect}</span>
                <TrendIcon trend={item.trend} />
              </div>
              <span className="text-xs font-medium" style={{ color: getScoreColor(item.score) }}>
                {item.score}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.score}%`,
                  backgroundColor: getScoreColor(item.score),
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Top advice */}
      <div className="bg-white/5 rounded-lg p-3">
        <p className="text-[10px] text-moonly-muted mb-1">💡 本周重点</p>
        <p className="text-xs text-white/80 leading-relaxed">
          {weekData.reduce((best, item) => item.score > best.score ? item : best, weekData[0]).advice}
        </p>
      </div>
    </div>
  )
}
