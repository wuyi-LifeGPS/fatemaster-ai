'use client'

import { useMemo } from 'react'

const DAILY_QUOTES = [
  { text: '天行健，君子以自强不息。', source: '《周易》' },
  { text: '地势坤，君子以厚德载物。', source: '《周易》' },
  { text: '知命者不怨天，知己者不怨人。', source: '《荀子》' },
  { text: '命由我作，福自己求。', source: '《了凡四训》' },
  { text: '积善之家，必有余庆；积不善之家，必有余殃。', source: '《周易》' },
  { text: '君子以俭德辟难，不可荣以禄。', source: '《周易》' },
  { text: '穷则变，变则通，通则久。', source: '《周易》' },
  { text: '同声相应，同气相求。', source: '《周易》' },
  { text: '二人同心，其利断金。', source: '《周易》' },
  { text: '天之所助者，顺也；人之所助者，信也。', source: '《周易》' },
  { text: '君子以见善则迁，有过则改。', source: '《周易》' },
  { text: '君子以思患而豫防之。', source: '《周易》' },
  { text: '一阴一阳之谓道。', source: '《周易》' },
  { text: '物以类聚，人以群分。', source: '《周易》' },
  { text: '时止则止，时行则行，动静不失其时，其道光明。', source: '《周易》' },
  { text: '君子以反身修德。', source: '《周易》' },
  { text: '君子以恐惧修省。', source: '《周易》' },
  { text: '君子以顺德，积小以高大。', source: '《周易》' },
  { text: '水流湿，火就燥。云从龙，风从虎。', source: '《周易》' },
  { text: '君子以遏恶扬善，顺天休命。', source: '《周易》' },
  { text: '君子以慎辨物居方。', source: '《周易》' },
  { text: '天地不交，否；君子以俭德辟难。', source: '《周易》' },
  { text: '天地交，泰；后以财成天地之道。', source: '《周易》' },
  { text: '君子以独立不惧，遁世无闷。', source: '《周易》' },
  { text: '日月丽乎天，百谷草木丽乎土。', source: '《周易》' },
  { text: '君子以言有物而行有恒。', source: '《周易》' },
  { text: '君子以非礼弗履。', source: '《周易》' },
  { text: '君子以多识前言往行，以畜其德。', source: '《周易》' },
  { text: '君子以作事谋始。', source: '《周易》' },
  { text: '君子以容民畜众。', source: '《周易》' },
]

export default function DailyQuote() {
  const quote = useMemo(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length]
  }, [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📜</span>
        <h3 className="text-gold text-sm font-semibold">每日一言</h3>
      </div>
      <blockquote className="text-white/80 text-sm leading-relaxed mb-2 pl-3 border-l-2 border-gold/30">
        {quote.text}
      </blockquote>
      <cite className="text-moonly-muted text-xs not-italic block text-right">
        —— {quote.source}
      </cite>
    </div>
  )
}
