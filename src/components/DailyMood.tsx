'use client'

import { useMemo } from 'react'

const DAILY_MOODS = [
  { mood: '阳光灿烂', emoji: '☀️', desc: '今天心情明媚，适合与人交流。', color: '#fbbf24' },
  { mood: '微风轻拂', emoji: '🍃', desc: '今天心情舒畅，适合户外活动。', color: '#4ade80' },
  { mood: '细雨绵绵', emoji: '🌧️', desc: '今天适合独处，静心思索。', color: '#60a5fa' },
  { mood: '星光璀璨', emoji: '✨', desc: '今天灵感迸发，适合创作。', color: '#a78bfa' },
  { mood: '月光如水', emoji: '🌙', desc: '今天内心平静，适合冥想。', color: '#818cf8' },
  { mood: '朝霞满天', emoji: '🌅', desc: '今天充满活力，适合挑战。', color: '#f87171' },
  { mood: '云淡风轻', emoji: '☁️', desc: '今天顺其自然，随遇而安。', color: '#94a3b8' },
  { mood: '彩虹当空', emoji: '🌈', desc: '今天好运连连，诸事顺遂。', color: '#f472b6' },
  { mood: '雪花纷飞', emoji: '❄️', desc: '今天适合沉淀，积累能量。', color: '#e2e8f0' },
  { mood: '春花烂漫', emoji: '🌸', desc: '今天桃花运旺，适合社交。', color: '#fbcfe8' },
  { mood: '夏日炎炎', emoji: '☀️', desc: '今天热情高涨，适合行动。', color: '#fbbf24' },
  { mood: '秋叶静美', emoji: '🍂', desc: '今天收获满满，适合总结。', color: '#d97706' },
  { mood: '冬雪皑皑', emoji: '❄️', desc: '今天适合内省，规划未来。', color: '#94a3b8' },
  { mood: '晨露晶莹', emoji: '💧', desc: '今天清新明亮，适合新的开始。', color: '#22d3ee' },
  { mood: '晚霞绚烂', emoji: '🌇', desc: '今天收获满满，适合感恩。', color: '#fb923c' },
  { mood: '星辰大海', emoji: '🌌', desc: '今天胸怀广阔，适合规划。', color: '#6366f1' },
  { mood: '清风徐来', emoji: '🎐', desc: '今天心情舒畅，适合放松。', color: '#a5f3fc' },
  { mood: '花香四溢', emoji: '🌺', desc: '今天魅力四射，适合社交。', color: '#f9a8d4' },
  { mood: '阳光明媚', emoji: '🌞', desc: '今天积极向上，适合挑战。', color: '#fcd34d' },
  { mood: '月色温柔', emoji: '🌛', desc: '今天温柔体贴，适合陪伴。', color: '#c7d2fe' },
  { mood: '云朵柔软', emoji: '☁️', desc: '今天轻松自在，适合休息。', color: '#e2e8f0' },
  { mood: '雨滴清脆', emoji: '🌧️', desc: '今天思绪清晰，适合思考。', color: '#7dd3fc' },
  { mood: '彩虹斑斓', emoji: '🌈', desc: '今天多彩多姿，适合尝试。', color: '#a78bfa' },
  { mood: '星光点点', emoji: '⭐', desc: '今天希望满满，适合梦想。', color: '#fde047' },
  { mood: '晨曦初露', emoji: '🌄', desc: '今天充满希望，适合开始。', color: '#fdba74' },
  { mood: '暮色温柔', emoji: '🌆', desc: '今天适合回顾，感恩一天。', color: '#fca5a5' },
  { mood: '海风轻抚', emoji: '🌊', desc: '今天心胸开阔，适合冒险。', color: '#67e8f9' },
  { mood: '山岚缭绕', emoji: '⛰️', desc: '今天沉稳内敛，适合深思。', color: '#86efac' },
  { mood: '花香鸟语', emoji: '🦜', desc: '今天生机勃勃，适合交流。', color: '#bef264' },
  { mood: '月光皎洁', emoji: '🌕', desc: '今天内心明亮，适合洞察。', color: '#fef08a' },
]

function getDailyMood(): typeof DAILY_MOODS[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_MOODS[dayOfYear % DAILY_MOODS.length]
}

export default function DailyMood() {
  const mood = useMemo(() => getDailyMood(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{mood.emoji}</span>
          <h3 className="text-gold text-sm font-semibold">今日心情</h3>
        </div>
        <span className="text-[10px] text-moonly-muted px-2 py-0.5 rounded-full bg-white/5">
          {mood.mood}
        </span>
      </div>

      <div className="text-center py-3">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl"
          style={{
            background: `${mood.color}20`,
            boxShadow: `0 0 30px ${mood.color}30`,
          }}
        >
          {mood.emoji}
        </div>
        <p className="text-white/80 text-sm leading-relaxed">{mood.desc}</p>
      </div>
    </div>
  )
}
