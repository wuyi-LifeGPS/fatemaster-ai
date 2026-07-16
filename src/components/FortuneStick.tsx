'use client'

import { useState, useCallback } from 'react'
import { hapticMedium } from '@/lib/haptic'
import { showToast } from '@/components/Toast'

const FORTUNE_STICKS = [
  { level: '上上签', emoji: '🌟', text: '时来运转，诸事顺遂。', poem: '乌云散尽月重明，枯木逢春再发芽。' },
  { level: '上签', emoji: '⭐', text: '吉星高照，心想事成。', poem: '春风得意马蹄疾，一日看尽长安花。' },
  { level: '中上签', emoji: '✨', text: '平安顺遂，小有收获。', poem: '柳暗花明又一村，守得云开见月明。' },
  { level: '中签', emoji: '🌙', text: '平平淡淡，无惊无喜。', poem: '平平淡淡才是真，细水长流福自来。' },
  { level: '中下签', emoji: '☁️', text: '稍有波折，谨慎行事。', poem: '山重水复疑无路，小心驶得万年船。' },
  { level: '下签', emoji: '🌧️', text: '运势低迷，宜静不宜动。', poem: '风雨过后见彩虹，静待时机莫强求。' },
]

export default function FortuneStick() {
  const [drawn, setDrawn] = useState(false)
  const [stick, setStick] = useState<typeof FORTUNE_STICKS[0] | null>(null)
  const [shaking, setShaking] = useState(false)

  const drawStick = useCallback(() => {
    if (shaking) return
    
    hapticMedium()
    setShaking(true)
    setDrawn(false)
    setStick(null)

    // Simulate shaking animation
    setTimeout(() => {
      const randomStick = FORTUNE_STICKS[Math.floor(Math.random() * FORTUNE_STICKS.length)]
      setStick(randomStick)
      setDrawn(true)
      setShaking(false)
      showToast(`抽到了${randomStick.level}！`, 'success')
    }, 1500)
  }, [shaking])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🎋</span>
        <h3 className="text-gold text-sm font-semibold">每日求签</h3>
      </div>

      {!drawn ? (
        <div className="text-center py-6">
          <div 
            className={`w-20 h-20 rounded-full bg-gold/10 mx-auto mb-4 flex items-center justify-center text-4xl cursor-pointer transition-transform ${shaking ? 'animate-shake' : 'hover:scale-105'}`}
            onClick={drawStick}
          >
            {shaking ? '🎋' : '🙏'}
          </div>
          <p className="text-white/60 text-sm">
            {shaking ? '摇签中...' : '点击求签'}
          </p>
        </div>
      ) : (
        <div className="text-center py-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-gold/20 mx-auto mb-3 flex items-center justify-center text-3xl">
            {stick?.emoji}
          </div>
          <p className="text-gold font-bold text-lg mb-1">{stick?.level}</p>
          <p className="text-white/80 text-sm mb-2">{stick?.text}</p>
          <p className="text-moonly-muted text-xs italic">{stick?.poem}</p>
          
          <button
            onClick={drawStick}
            className="mt-4 px-4 py-2 rounded-full bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors"
          >
            再求一签
          </button>
        </div>
      )}
    </div>
  )
}
