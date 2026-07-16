'use client'

import { useMemo } from 'react'

const FENG_SHUI_TIPS = [
  { title: '财位', tip: '财位宜明亮，可放置绿植或水晶招财', emoji: '💰' },
  { title: '桃花位', tip: '桃花位宜摆放鲜花，增进人际关系', emoji: '🌸' },
  { title: '文昌位', tip: '文昌位宜整洁，放置文昌塔助学业', emoji: '📚' },
  { title: '健康位', tip: '健康位宜通风，避免堆积杂物', emoji: '💪' },
  { title: '事业位', tip: '事业位宜有靠山，背后不宜为空', emoji: '💼' },
  { title: '贵人位', tip: '贵人位宜明亮，可挂吉祥画', emoji: '🤝' },
  { title: '玄关', tip: '玄关宜整洁明亮，不宜正对厕所', emoji: '🚪' },
  { title: '卧室', tip: '床头宜靠实墙，不宜正对镜子', emoji: '🛏️' },
  { title: '厨房', tip: '灶台不宜正对水槽，火水不相容', emoji: '🍳' },
  { title: '卫生间', tip: '卫生间宜保持干燥，门常关闭', emoji: '🚿' },
  { title: '客厅', tip: '客厅宜方正，沙发宜呈U形摆放', emoji: '🛋️' },
  { title: '阳台', tip: '阳台宜通风采光，可种吉祥植物', emoji: '🌿' },
  { title: '书房', tip: '书桌宜面向门口，不宜背对门', emoji: '📖' },
  { title: '餐厅', tip: '餐桌宜圆形，寓意团圆美满', emoji: '🍽️' },
  { title: '走廊', tip: '走廊宜通畅，不宜过长或阴暗', emoji: '🚶' },
]

export default function FengShuiTip() {
  const tip = useMemo(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    return FENG_SHUI_TIPS[dayOfYear % FENG_SHUI_TIPS.length]
  }, [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🏠</span>
        <h3 className="text-gold text-sm font-semibold">风水小贴士</h3>
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
