'use client'

import { useMemo } from 'react'

const DAILY_REFLECTIONS = [
  { emoji: '🌅', title: '晨思', text: '今日醒来，感恩生命的馈赠。' },
  { emoji: '🌞', title: '日省', text: '今日所为，是否问心无愧？' },
  { emoji: '🌙', title: '暮省', text: '今日所学，是否有所成长？' },
  { emoji: '⭐', title: '星思', text: '今日所梦，是否值得追寻？' },
  { emoji: '🌊', title: '潮思', text: '今日起伏，是否顺其自然？' },
  { emoji: '🍃', title: '风思', text: '今日所遇，是否随遇而安？' },
  { emoji: '⛰️', title: '山思', text: '今日所难，是否坚持不懈？' },
  { emoji: '🌸', title: '花思', text: '今日所美，是否用心感受？' },
  { emoji: '🔥', title: '火思', text: '今日所怒，是否冷静处理？' },
  { emoji: '💧', title: '水思', text: '今日所柔，是否以柔克刚？' },
  { emoji: '🌳', title: '木思', text: '今日所立，是否根深蒂固？' },
  { emoji: '⚡', title: '雷思', text: '今日所惊，是否处变不惊？' },
  { emoji: '🌈', title: '虹思', text: '今日所望，是否彩虹将至？' },
  { emoji: '❄️', title: '雪思', text: '今日所净，是否心境澄明？' },
  { emoji: '🌻', title: '阳思', text: '今日所暖，是否传递他人？' },
  { emoji: '🌑', title: '月思', text: '今日所缺，是否接纳圆满？' },
  { emoji: '💫', title: '星思', text: '今日所望，是否仰望星空？' },
  { emoji: '🌏', title: '地思', text: '今日所行，是否脚踏实地？' },
  { emoji: '☁️', title: '云思', text: '今日所浮，是否云淡风轻？' },
  { emoji: '🌪️', title: '风思', text: '今日所变，是否随风而动？' },
  { emoji: '🌋', title: '火思', text: '今日所燃，是否热情似火？' },
  { emoji: '🏔️', title: '峰思', text: '今日所攀，是否勇攀高峰？' },
  { emoji: '🌌', title: '空思', text: '今日所悟，是否豁然开朗？' },
  { emoji: '🦋', title: '蝶思', text: '今日所变，是否破茧成蝶？' },
  { emoji: '🐉', title: '龙思', text: '今日所飞，是否龙腾四海？' },
  { emoji: '🦅', title: '鹰思', text: '今日所视，是否高瞻远瞩？' },
  { emoji: '🐢', title: '龟思', text: '今日所稳，是否稳扎稳打？' },
  { emoji: '🦚', title: '凤思', text: '今日所华，是否凤凰涅槃？' },
  { emoji: '🦁', title: '狮思', text: '今日所勇，是否狮心无畏？' },
  { emoji: '🌿', title: '草思', text: '今日所生，是否生生不息？' },
]

function getDailyReflection(): typeof DAILY_REFLECTIONS[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_REFLECTIONS[dayOfYear % DAILY_REFLECTIONS.length]
}

export default function DailyReflection() {
  const reflection = useMemo(() => getDailyReflection(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🪞</span>
        <h3 className="text-gold text-sm font-semibold">每日反思</h3>
      </div>

      <div className="text-center py-2">
        <div className="w-16 h-16 rounded-full bg-gold/10 mx-auto mb-3 flex items-center justify-center text-3xl">
          {reflection.emoji}
        </div>
        <p className="text-white font-medium text-sm mb-1">{reflection.title}</p>
        <p className="text-white/60 text-sm leading-relaxed">{reflection.text}</p>
      </div>
    </div>
  )
}
