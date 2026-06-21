'use client'

import { useState } from 'react'
import Link from 'next/link'

const DIVINATION_TOOLS = [
  {
    icon: '六',
    label: '六爻卜卦',
    desc: '铜钱起卦，问事占断',
    href: '/bu/liuyao',
    status: 'coming',
    color: 'from-amber-500/20 to-amber-600/10',
    border: 'border-amber-500/20',
  },
  {
    icon: '梅',
    label: '梅花易数',
    desc: '象数起卦，随心而动',
    href: '/bu/meihua',
    status: 'coming',
    color: 'from-pink-500/20 to-pink-600/10',
    border: 'border-pink-500/20',
  },
  {
    icon: '紫',
    label: '紫微斗数',
    desc: '星曜排盘，命格详解',
    href: '/bu/ziwei',
    status: 'coming',
    color: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/20',
  },
  {
    icon: '梦',
    label: '周公解梦',
    desc: '梦境解析，吉凶预兆',
    href: '/bu/jiemeng',
    status: 'coming',
    color: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/20',
  },
  {
    icon: '塔',
    label: '塔罗占卜',
    desc: '西方塔罗，牌阵解读',
    href: '/bu/tarot',
    status: 'coming',
    color: 'from-indigo-500/20 to-indigo-600/10',
    border: 'border-indigo-500/20',
  },
  {
    icon: '谕',
    label: '神谕卡',
    desc: '灵性指引，每日启示',
    href: '/bu/oracle',
    status: 'coming',
    color: 'from-teal-500/20 to-teal-600/10',
    border: 'border-teal-500/20',
  },
]

export default function BuPage() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const categories = ['全部', '东方', '西方', '日常']

  const filtered = activeCategory === '全部'
    ? DIVINATION_TOOLS
    : activeCategory === '东方'
    ? DIVINATION_TOOLS.slice(0, 3)
    : activeCategory === '西方'
    ? DIVINATION_TOOLS.slice(3, 5)
    : DIVINATION_TOOLS.slice(4, 6)

  return (
    <div className="px-4 pt-4 pb-24 animate-fade-in">
      <h1 className="text-gold-gradient text-xl font-bold mb-2">卜</h1>
      <p className="text-moonly-text-secondary text-sm mb-6">选择占卜工具，探寻心中答案</p>

      {/* 分类筛选 */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === cat
                ? 'bg-moonly-gold text-moonly-bg font-semibold'
                : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 工具网格 */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map(tool => (
          <div
            key={tool.label}
            className={`moonly-card p-4 flex flex-col items-center text-center gap-2 relative overflow-hidden ${tool.border}`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl`}>
              {tool.icon}
            </div>
            <div>
              <div className="text-white font-medium text-sm">{tool.label}</div>
              <div className="text-moonly-text-muted text-xs mt-0.5">{tool.desc}</div>
            </div>
            {tool.status === 'coming' && (
              <div className="absolute top-2 right-2 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-moonly-text-muted">
                开发中
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI 命理师快捷入口 */}
      <div className="mt-8 moonly-card p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-moonly-gold/20 flex-shrink-0">
          <img src="/images/ai-avatar-new.png" alt="AI" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="text-white font-medium text-sm">AI 命理师</div>
          <div className="text-moonly-text-muted text-xs">有任何命理问题，可以直接问 AI</div>
        </div>
        <Link
          href="/bu/chat"
          className="px-3 py-1.5 rounded-full bg-moonly-gold/10 text-gold text-xs font-medium border border-moonly-gold/20 hover:bg-moonly-gold/20 transition"
        >
          咨询
        </Link>
      </div>
    </div>
  )
}
