'use client'

import { useState } from 'react'
import Link from 'next/link'
import { hapticLight } from '@/lib/haptic'

interface Tool {
  id: string
  name: string
  icon: string
  desc: string
  href: string
  category: string
}

const TOOLS: Tool[] = [
  { id: 'bazi', name: '八字排盘', icon: '🎯', desc: '输入生辰八字排盘', href: '/bazi', category: '核心' },
  { id: 'match', name: '八字合婚', icon: '💕', desc: '双方八字配对分析', href: '/match', category: '核心' },
  { id: 'career', name: '事业分析', icon: '💼', desc: '事业运势与合作分析', href: '/career', category: '核心' },
  { id: 'talent', name: '天赋分析', icon: '🌟', desc: '发现你的天赋潜能', href: '/talent', category: '核心' },
  { id: 'naming', name: '智能起名', icon: '✨', desc: '根据八字五行起名', href: '/naming', category: '核心' },
  { id: 'academy', name: '命理学堂', icon: '📚', desc: '学习命理基础知识', href: '/academy', category: '学习' },
  { id: 'weekly', name: '运势周报', icon: '📊', desc: '本周7天运势预测', href: '/weekly-report', category: '运势' },
  { id: 'lucky', name: '开运指南', icon: '✨', desc: '今日开运色/吉时/方位', href: '/lucky-guide', category: '运势' },
  { id: 'tarot', name: '塔罗占卜', icon: '🎴', desc: 'AI塔罗牌占卜', href: '/bu/tarot', category: '占卜' },
  { id: 'chat', name: 'AI命理师', icon: '🤖', desc: 'AI命理咨询对话', href: '/bu/chat', category: 'AI' },
  { id: 'favorites', name: '我的收藏', icon: '⭐', desc: '查看收藏的内容', href: '/wo/favorites', category: '我的' },
  { id: 'history', name: '查询历史', icon: '📋', desc: '历史分析记录', href: '/history', category: '我的' },
]

const CATEGORIES = ['全部', '核心', '运势', '占卜', 'AI', '学习', '我的']

export default function ToolboxPage() {
  const [activeCategory, setActiveCategory] = useState('全部')

  const filtered = activeCategory === '全部'
    ? TOOLS
    : TOOLS.filter(t => t.category === activeCategory)

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/ming" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-gold-gradient text-xl font-bold">工具箱</h1>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { hapticLight(); setActiveCategory(cat); }}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-gold/20 text-gold'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map(tool => (
          <Link
            key={tool.id}
            href={tool.href}
            className="moonly-card p-4 hover:bg-white/5 transition active:scale-95"
          >
            <span className="text-3xl">{tool.icon}</span>
            <h3 className="text-white text-sm font-medium mt-2">{tool.name}</h3>
            <p className="text-[10px] text-moonly-muted mt-1">{tool.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
