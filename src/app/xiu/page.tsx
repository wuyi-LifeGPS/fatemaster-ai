'use client'

import { useState } from 'react'
import Link from 'next/link'

const PRACTICES = [
  { icon: '🔮', label: '塔罗牌', desc: '每日一抽，洞察当下' },
  { icon: '🌙', label: '解梦', desc: '解析梦境中的隐喻' },
  { icon: 'ᚱ', label: '卢恩符文', desc: '北欧符文每日指引' },
  { icon: '✨', label: '神谕卡', desc: '灵性指引与启示' },
  { icon: '🧘', label: '冥想', desc: '正念静心修行' },
]

export default function XiuPage() {
  const [active, setActive] = useState('冥想')

  return (
    <div className="px-4 pt-4 pb-24 animate-fade-in">
      <h1 className="text-gold-gradient text-xl font-bold mb-6">修习</h1>

      {/* 分类标签 */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
        {PRACTICES.map(p => (
          <button
            key={p.label}
            onClick={() => setActive(p.label)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
              active === p.label
                ? 'bg-moonly-gold text-moonly-bg font-semibold'
                : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 主内容 */}
      <div className="moonly-card p-5 text-center">
        <div className="text-4xl mb-3">🧘</div>
        <h2 className="text-white font-bold text-lg mb-1">冥想入门</h2>
        <p className="text-moonly-text-secondary text-sm mb-4">每日冥想，清理杂念，回归内心平静</p>

        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-moonly-text-muted text-xs">热门 · 13 分钟</span>
        </div>

        <button className="btn-gold px-8 py-3 text-sm font-semibold w-full">
          开始冥想
        </button>
      </div>

      {/* 推荐列表 */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium text-sm">推荐</h3>
          <span className="text-moonly-gold text-xs">更多 ›</span>
        </div>
        <div className="space-y-3">
          {[
            { title: '与高我连接', tag: '音疗', time: '27 分钟', icon: '🎵' },
            { title: '七脉轮净化', tag: '冥想', time: '21 分钟', icon: '🔥' },
            { title: '睡前放松', tag: '助眠', time: '15 分钟', icon: '🌙' },
          ].map(item => (
            <div key={item.title} className="moonly-card p-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{item.title}</div>
                <div className="text-moonly-text-muted text-xs">{item.tag} · {item.time}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-moonly-gold/10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-moonly-gold">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
