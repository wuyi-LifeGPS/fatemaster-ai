'use client'

import { useMemo, memo } from 'react'

const DAILY_AFFIRMATIONS = [
  { text: '我值得拥有美好的一切。', emoji: '✨' },
  { text: '我充满能量和自信。', emoji: '💪' },
  { text: '我吸引正能量和好运。', emoji: '🧲' },
  { text: '我感恩生活中的每一份美好。', emoji: '🙏' },
  { text: '我相信自己的直觉。', emoji: '🔮' },
  { text: '我释放所有负面情绪。', emoji: '🌊' },
  { text: '我选择快乐和平安。', emoji: '😊' },
  { text: '我被爱和善意包围。', emoji: '❤️' },
  { text: '我有能力创造我想要的生活。', emoji: '🎨' },
  { text: '我接受并爱自己原本的样子。', emoji: '🦋' },
  { text: '我每天都在变得更好。', emoji: '🌱' },
  { text: '我拥有无限的潜力。', emoji: '💎' },
  { text: '我选择看到事物美好的一面。', emoji: '🌈' },
  { text: '我值得被尊重和珍惜。', emoji: '👑' },
  { text: '我充满创造力和灵感。', emoji: '💡' },
  { text: '我信任生命的安排。', emoji: '🌟' },
  { text: '我散发着自信和魅力。', emoji: '✨' },
  { text: '我接纳所有的情绪，它们都会过去。', emoji: '🍃' },
  { text: '我选择原谅，释放自己。', emoji: '🕊️' },
  { text: '我为自己的进步感到骄傲。', emoji: '🏆' },
  { text: '我拥有改变的力量。', emoji: '🔥' },
  { text: '我专注于当下，享受此刻。', emoji: '🎁' },
  { text: '我吸引成功和丰盛。', emoji: '💰' },
  { text: '我的内心充满平静。', emoji: '🧘' },
  { text: '我对自己有耐心。', emoji: '⏳' },
  { text: '我选择积极的思考方式。', emoji: '☀️' },
  { text: '我值得被温柔对待。', emoji: '🌸' },
  { text: '我释放对过去的执着。', emoji: '🎈' },
  { text: '我对未来充满期待。', emoji: '🚀' },
  { text: '我是独一无二的。', emoji: '💫' },
]

function getDailyAffirmation(): typeof DAILY_AFFIRMATIONS[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_AFFIRMATIONS[dayOfYear % DAILY_AFFIRMATIONS.length]
}

function DailyAffirmation() {
  const affirmation = useMemo(() => getDailyAffirmation(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🌟</span>
        <h3 className="text-gold text-sm font-semibold">每日肯定</h3>
      </div>

      <div className="text-center py-3">
        <div className="w-16 h-16 rounded-full bg-gold/10 mx-auto mb-3 flex items-center justify-center text-3xl">
          {affirmation.emoji}
        </div>
        <p className="text-white/80 text-sm leading-relaxed">{affirmation.text}</p>
      </div>
    </div>
  )
}

export default memo(DailyAffirmation)
