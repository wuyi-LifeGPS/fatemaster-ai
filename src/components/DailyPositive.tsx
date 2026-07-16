'use client'

import { useMemo } from 'react'

const POSITIVE_MESSAGES = [
  { text: '今天的你，比昨天更强大。', emoji: '💪' },
  { text: '每一个清晨，都是新的开始。', emoji: '🌅' },
  { text: '相信自己，你比想象中更优秀。', emoji: '⭐' },
  { text: '困难只是暂时的，坚持就是胜利。', emoji: '🏆' },
  { text: '你的努力，终将开花结果。', emoji: '🌸' },
  { text: '保持微笑，好运自然来。', emoji: '😊' },
  { text: '今天的付出，是明天的收获。', emoji: '🌾' },
  { text: '你比自己想象的更有力量。', emoji: '🔥' },
  { text: '每一个挑战，都是成长的机会。', emoji: '🌱' },
  { text: '不要害怕失败，它只是成功的垫脚石。', emoji: '🪜' },
  { text: '你的潜力，远未被发掘。', emoji: '💎' },
  { text: '今天也是充满希望的一天。', emoji: '🌈' },
  { text: '坚持下去，你离成功不远了。', emoji: '🏃' },
  { text: '相信自己，你可以做到。', emoji: '✨' },
  { text: '每一次尝试，都是进步。', emoji: '📈' },
  { text: '你的未来，由你自己创造。', emoji: '🎨' },
  { text: '保持积极，好事即将发生。', emoji: '🍀' },
  { text: '今天的努力，是明天的骄傲。', emoji: '🏅' },
  { text: '不要放弃，你正在接近目标。', emoji: '🎯' },
  { text: '你的坚持，终将闪耀。', emoji: '💫' },
  { text: '每一个今天，都是余生中最年轻的一天。', emoji: '⏰' },
  { text: '你的价值，不取决于别人的看法。', emoji: '👑' },
  { text: '勇敢迈出第一步，成功就在前方。', emoji: '🚪' },
  { text: '你的内心，比你想象的更强大。', emoji: '❤️' },
  { text: '今天的你，已经是最好的自己。', emoji: '🌟' },
  { text: '每一次跌倒，都是为了更好地站起来。', emoji: '🦋' },
  { text: '你的梦想，值得全力以赴。', emoji: '🚀' },
  { text: '保持热爱，奔赴山海。', emoji: '🌊' },
  { text: '今天的你，闪闪发光。', emoji: '✨' },
  { text: '你的努力，终将照亮前路。', emoji: '💡' },
]

function getDailyPositive(): typeof POSITIVE_MESSAGES[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return POSITIVE_MESSAGES[dayOfYear % POSITIVE_MESSAGES.length]
}

export default function DailyPositive() {
  const message = useMemo(() => getDailyPositive(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{message.emoji}</span>
        <h3 className="text-gold text-sm font-semibold">今日正能量</h3>
      </div>

      <div className="text-center py-2">
        <p className="text-white/80 text-sm leading-relaxed">{message.text}</p>
      </div>
    </div>
  )
}
