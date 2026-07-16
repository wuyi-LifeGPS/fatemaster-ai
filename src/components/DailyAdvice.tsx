'use client'

import { useMemo, memo } from 'react'

const DAILY_ADVICE = [
  { emoji: '💼', title: '工作建议', text: '今日工作效率高，适合处理重要事务。' },
  { emoji: '💕', title: '感情建议', text: '今日适合表达心意，增进感情。' },
  { emoji: '💰', title: '财运建议', text: '今日财运平稳，不宜冒险投资。' },
  { emoji: '🏃', title: '健康建议', text: '今日适合户外运动，增强体质。' },
  { emoji: '📚', title: '学习建议', text: '今日记忆力好，适合学习新知识。' },
  { emoji: '🤝', title: '人际建议', text: '今日人缘旺盛，适合社交活动。' },
  { emoji: '🎨', title: '创意建议', text: '今日灵感迸发，适合创作。' },
  { emoji: '🧘', title: '修身建议', text: '今日适合冥想，净化心灵。' },
  { emoji: '🌱', title: '成长建议', text: '今日适合反思，规划未来。' },
  { emoji: '🎯', title: '目标建议', text: '今日执行力强，适合推进计划。' },
  { emoji: '🌟', title: '机遇建议', text: '今日机遇多多，把握时机。' },
  { emoji: '⚡', title: '行动建议', text: '今日能量充沛，适合行动。' },
  { emoji: '🌈', title: '心态建议', text: '今日保持乐观，好运自来。' },
  { emoji: '💎', title: '价值建议', text: '今日展现价值，获得认可。' },
  { emoji: '🔥', title: '热情建议', text: '今日热情洋溢，感染他人。' },
  { emoji: '🌊', title: '灵活建议', text: '今日顺势而为，灵活应对。' },
  { emoji: '⛰️', title: '稳重建议', text: '今日稳扎稳打，踏实前行。' },
  { emoji: '🦋', title: '蜕变建议', text: '今日突破自我，迎接变化。' },
  { emoji: '🌺', title: '魅力建议', text: '今日魅力四射，吸引好运。' },
  { emoji: '🚀', title: '进取建议', text: '今日勇往直前，追逐梦想。' },
  { emoji: '🎵', title: '和谐建议', text: '今日保持和谐，享受当下。' },
  { emoji: '📖', title: '智慧建议', text: '今日汲取智慧，提升自我。' },
  { emoji: '💡', title: '洞察建议', text: '今日洞察力强，看清本质。' },
  { emoji: '🌿', title: '自然建议', text: '今日亲近自然，放松身心。' },
  { emoji: '🦅', title: '视野建议', text: '今日视野开阔，格局提升。' },
  { emoji: '🐉', title: '腾飞建议', text: '今日龙腾虎跃，大展宏图。' },
  { emoji: '🦁', title: '勇气建议', text: '今日勇气倍增，敢于挑战。' },
  { emoji: '🦚', title: '展现建议', text: '今日展现才华，获得赞赏。' },
  { emoji: '🐢', title: '耐心建议', text: '今日耐心行事，厚积薄发。' },
  { emoji: '🌻', title: '阳光建议', text: '今日积极向上，充满希望。' },
]

function getDailyAdvice(): typeof DAILY_ADVICE[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_ADVICE[dayOfYear % DAILY_ADVICE.length]
}

function DailyAdvice() {
  const advice = useMemo(() => getDailyAdvice(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">💡</span>
        <h3 className="text-gold text-sm font-semibold">每日建议</h3>
      </div>

      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: '#c9a96e20' }}
        >
          {advice.emoji}
        </div>
        <div>
          <p className="text-white font-medium text-sm mb-1">{advice.title}</p>
          <p className="text-white/60 text-sm leading-relaxed">{advice.text}</p>
        </div>
      </div>
    </div>
  )
}

export default memo(DailyAdvice)
