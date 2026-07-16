'use client'

import { useMemo } from 'react'

const HEALTH_TIPS = [
  { title: '春季养生', tip: '春养肝，宜多食绿色蔬菜，保持心情舒畅', emoji: '🌱', season: 'spring' },
  { title: '夏季养生', tip: '夏养心，宜清淡饮食，避免过度劳累', emoji: '☀️', season: 'summer' },
  { title: '秋季养生', tip: '秋养肺，宜多食白色食物，注意保湿', emoji: '🍂', season: 'autumn' },
  { title: '冬季养生', tip: '冬养肾，宜温补，注意保暖早睡晚起', emoji: '❄️', season: 'winter' },
  { title: '饮食建议', tip: '早餐吃好，午餐吃饱，晚餐吃少', emoji: '🥗', season: 'all' },
  { title: '运动建议', tip: '每日步行30分钟，疏通经络，强身健体', emoji: '🚶', season: 'all' },
  { title: '睡眠建议', tip: '子时前入睡，保证7-8小时优质睡眠', emoji: '😴', season: 'all' },
  { title: '情绪管理', tip: '保持平和心态，怒伤肝，喜伤心，忧伤肺', emoji: '🧘', season: 'all' },
  { title: '饮水建议', tip: '晨起一杯温水，每日饮水1500-2000ml', emoji: '💧', season: 'all' },
  { title: '穴位按摩', tip: '常按足三里、合谷穴，强身健体', emoji: '💆', season: 'all' },
]

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

function getDailyHealthTip(): typeof HEALTH_TIPS[0] {
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const season = getCurrentSeason()

  // 优先选择与当前季节相关的建议
  const seasonalTips = HEALTH_TIPS.filter(t => t.season === season || t.season === 'all')
  return seasonalTips[dayOfYear % seasonalTips.length]
}

export default function HealthTip() {
  const tip = useMemo(() => getDailyHealthTip(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🌿</span>
        <h3 className="text-gold text-sm font-semibold">养生建议</h3>
      </div>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{tip.emoji}</span>
        <div>
          <div className="text-white text-sm font-medium mb-1">{tip.title}</div>
          <p className="text-moonly-muted text-xs leading-relaxed">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}
