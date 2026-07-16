'use client'

import { useMemo } from 'react'

const HEALTH_TIPS = [
  { category: '饮食', emoji: '🍎', tip: '多吃蔬菜水果，保持营养均衡。' },
  { category: '运动', emoji: '🏃', tip: '每天坚持运动30分钟，保持身体健康。' },
  { category: '睡眠', emoji: '😴', tip: '保证7-8小时睡眠，早睡早起身体好。' },
  { category: '心态', emoji: '🧘', tip: '保持乐观心态，压力要学会释放。' },
  { category: '饮水', emoji: '💧', tip: '每天喝8杯水，保持身体水分充足。' },
  { category: '护眼', emoji: '👀', tip: '每隔1小时远眺5分钟，缓解眼部疲劳。' },
  { category: '坐姿', emoji: '🪑', tip: '保持正确坐姿，避免久坐不动。' },
  { category: '呼吸', emoji: '🌬️', tip: '深呼吸练习，缓解压力和焦虑。' },
  { category: '饮食', emoji: '🥗', tip: '少吃油腻食物，清淡饮食更健康。' },
  { category: '运动', emoji: '🧘', tip: '瑜伽和拉伸，放松身心。' },
  { category: '睡眠', emoji: '🌙', tip: '睡前1小时不玩手机，提高睡眠质量。' },
  { category: '心态', emoji: '😊', tip: '每天微笑10次，心情自然好。' },
  { category: '饮水', emoji: '🍵', tip: '多喝温水，促进身体代谢。' },
  { category: '护眼', emoji: '🌳', tip: '多看绿色植物，缓解眼部疲劳。' },
  { category: '坐姿', emoji: '🚶', tip: '每坐1小时起身活动5分钟。' },
  { category: '呼吸', emoji: '🌸', tip: '到户外呼吸新鲜空气，感受自然。' },
  { category: '饮食', emoji: '🥑', tip: '适量摄入优质脂肪，有益心脑血管。' },
  { category: '运动', emoji: '💪', tip: '力量训练增强肌肉，提高基础代谢。' },
  { category: '睡眠', emoji: '🛏️', tip: '保持卧室安静黑暗，营造睡眠环境。' },
  { category: '心态', emoji: '🎵', tip: '听舒缓音乐，放松心情。' },
  { category: '饮水', emoji: '🍋', tip: '水中加片柠檬，补充维C。' },
  { category: '护眼', emoji: '📱', tip: '减少看手机时间，保护视力。' },
  { category: '坐姿', emoji: '🧘', tip: '冥想10分钟，放松身心。' },
  { category: '呼吸', emoji: '🌊', tip: '海边散步，呼吸海风。' },
  { category: '饮食', emoji: '🥜', tip: '适量坚果有益心脑血管健康。' },
  { category: '运动', emoji: '🚴', tip: '骑行是低冲击有氧运动，保护关节。' },
  { category: '睡眠', emoji: '☀️', tip: '白天多晒太阳，调节生物钟。' },
  { category: '心态', emoji: '🌈', tip: '培养兴趣爱好，丰富精神生活。' },
  { category: '饮水', emoji: '🌿', tip: '适量饮茶，抗氧化。' },
  { category: '护眼', emoji: '💡', tip: '保持适当光线，避免暗光用眼。' },
]

function getDailyHealth(): typeof HEALTH_TIPS[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return HEALTH_TIPS[dayOfYear % HEALTH_TIPS.length]
}

export default function DailyHealth() {
  const health = useMemo(() => getDailyHealth(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{health.emoji}</span>
        <h3 className="text-gold text-sm font-semibold">健康小贴士</h3>
        <span className="text-[10px] text-moonly-muted px-2 py-0.5 rounded-full bg-white/5 ml-auto">
          {health.category}
        </span>
      </div>

      <p className="text-white/80 text-sm leading-relaxed">{health.tip}</p>
    </div>
  )
}
