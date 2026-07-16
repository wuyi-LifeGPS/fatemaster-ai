'use client'

import { useMemo, memo } from 'react'

const DAILY_INSIGHTS = [
  { emoji: '🔮', title: '今日洞察', text: '今日直觉敏锐，相信第一感觉。' },
  { emoji: '💫', title: '今日启示', text: '今日可能有意外的领悟，保持开放心态。' },
  { emoji: '🌟', title: '今日指引', text: '今日跟随内心，做自己认为对的事。' },
  { emoji: '✨', title: '今日灵感', text: '今日创意无限，记录闪现的想法。' },
  { emoji: '💡', title: '今日领悟', text: '今日适合深度学习，会有新发现。' },
  { emoji: '🎯', title: '今日聚焦', text: '今日专注当下，效率倍增。' },
  { emoji: '🌈', title: '今日视野', text: '今日换个角度看问题，豁然开朗。' },
  { emoji: '🔥', title: '今日能量', text: '今日精力充沛，适合挑战难题。' },
  { emoji: '🌊', title: '今日流动', text: '今日顺势而为，不要强求。' },
  { emoji: '⛰️', title: '今日定力', text: '今日保持定力，不为外物所动。' },
  { emoji: '🦋', title: '今日蜕变', text: '今日适合改变，拥抱新可能。' },
  { emoji: '🌺', title: '今日绽放', text: '今日展现真我，散发魅力。' },
  { emoji: '🚀', title: '今日突破', text: '今日突破极限，超越自我。' },
  { emoji: '🎵', title: '今日和谐', text: '今日内外和谐，身心愉悦。' },
  { emoji: '📖', title: '今日智慧', text: '今日适合阅读，汲取智慧。' },
  { emoji: '💎', title: '今日价值', text: '今日创造价值，获得成就感。' },
  { emoji: '⚡', title: '今日行动', text: '今日立即行动，不要拖延。' },
  { emoji: '🌱', title: '今日成长', text: '今日播种希望，未来可期。' },
  { emoji: '🦅', title: '今日高度', text: '今日登高望远，格局提升。' },
  { emoji: '🐉', title: '今日腾飞', text: '今日龙飞凤舞，势不可挡。' },
  { emoji: '🦁', title: '今日勇气', text: '今日勇敢前行，无所畏惧。' },
  { emoji: '🦚', title: '今日展现', text: '今日展示才华，光芒四射。' },
  { emoji: '🐢', title: '今日稳健', text: '今日稳扎稳打，步步为营。' },
  { emoji: '🌻', title: '今日阳光', text: '今日向阳而生，积极乐观。' },
  { emoji: '🌙', title: '今日内省', text: '今日静心思索，洞察内心。' },
  { emoji: '☀️', title: '今日明朗', text: '今日心胸开阔，光明磊落。' },
  { emoji: '🍃', title: '今日清新', text: '今日清新自然，焕然一新。' },
  { emoji: '🌸', title: '今日美好', text: '今日美好相伴，幸福满满。' },
  { emoji: '❄️', title: '今日纯净', text: '今日纯净心灵，不染尘埃。' },
  { emoji: '🌅', title: '今日希望', text: '今日充满希望，迎接新生。' },
]

function getDailyInsight(): typeof DAILY_INSIGHTS[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_INSIGHTS[dayOfYear % DAILY_INSIGHTS.length]
}

function DailyInsight() {
  const insight = useMemo(() => getDailyInsight(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔮</span>
        <h3 className="text-gold text-sm font-semibold">今日洞察</h3>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-2xl shrink-0">
          {insight.emoji}
        </div>
        <div>
          <p className="text-white font-medium text-sm mb-1">{insight.title}</p>
          <p className="text-white/60 text-sm leading-relaxed">{insight.text}</p>
        </div>
      </div>
    </div>
  )
}

export default memo(DailyInsight)
