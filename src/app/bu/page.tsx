'use client'

import { useState } from 'react'
import Link from 'next/link'

const DIVINATION_TOOLS = [
  {
    icon: '六',
    label: '六爻卜卦',
    desc: '铜钱起卦，问事占断',
    href: '/bu/liuyao',
    status: 'ready',
    category: '东方',
    color: 'from-amber-500/20 to-amber-600/10',
    border: 'border-amber-500/20',
  },
  {
    icon: '钱',
    label: '金钱卦',
    desc: '三枚铜钱，六爻成卦',
    href: '/bu/coin',
    status: 'ready',
    category: '东方',
    color: 'from-yellow-500/20 to-yellow-600/10',
    border: 'border-yellow-500/20',
  },
  {
    icon: '梅',
    label: '梅花易数',
    desc: '象数起卦，随心而动',
    href: '/bu/meihua',
    status: 'ready',
    category: '东方',
    color: 'from-pink-500/20 to-pink-600/10',
    border: 'border-pink-500/20',
  },
  {
    icon: '婚',
    label: '八字合婚',
    desc: '八字配对，缘分天定',
    href: '/bu/bazi-match',
    status: 'ready',
    category: '日常',
    color: 'from-red-500/20 to-red-600/10',
    border: 'border-red-500/20',
  },
  {
    icon: '职',
    label: '求职运势',
    desc: '求职顺利，前程似锦',
    href: '/bu/job-fortune',
    status: 'ready',
    category: '日常',
    color: 'from-indigo-500/20 to-indigo-600/10',
    border: 'border-indigo-500/20',
  },
  {
    icon: '业',
    label: '开业运势',
    desc: '开业大吉，财源广进',
    href: '/bu/business-fortune',
    status: 'ready',
    category: '日常',
    color: 'from-amber-500/20 to-amber-600/10',
    border: 'border-amber-500/20',
  },
  {
    icon: '搬',
    label: '搬家运势',
    desc: '乔迁新居，择日而行',
    href: '/bu/move-fortune',
    status: 'ready',
    category: '日常',
    color: 'from-brown-500/20 to-brown-600/10',
    border: 'border-brown-500/20',
  },
  {
    icon: '康',
    label: '健康运势',
    desc: '身体为本，健康第一',
    href: '/bu/health-fortune',
    status: 'ready',
    category: '日常',
    color: 'from-teal-500/20 to-teal-600/10',
    border: 'border-teal-500/20',
  },
  {
    icon: '投',
    label: '投资运势',
    desc: '财运亨通，投资有道',
    href: '/bu/invest-fortune',
    status: 'ready',
    category: '日常',
    color: 'from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: '恋',
    label: '恋爱运势',
    desc: '桃花运来，缘分天定',
    href: '/bu/love-fortune',
    status: 'ready',
    category: '日常',
    color: 'from-rose-500/20 to-rose-600/10',
    border: 'border-rose-500/20',
  },
  {
    icon: '考',
    label: '考试运势',
    desc: '逢考必过，金榜题名',
    href: '/bu/exam-fortune',
    status: 'ready',
    category: '日常',
    color: 'from-violet-500/20 to-violet-600/10',
    border: 'border-violet-500/20',
  },
  {
    icon: '旅',
    label: '旅行运势',
    desc: '出行吉时，平安顺遂',
    href: '/bu/travel-fortune',
    status: 'ready',
    category: '日常',
    color: 'from-sky-500/20 to-sky-600/10',
    border: 'border-sky-500/20',
  },
  {
    icon: '植',
    label: '植物运势',
    desc: '看看你家绿植今日状态',
    href: '/bu/plant-fortune',
    status: 'ready',
    category: '日常',
    color: 'from-green-500/20 to-green-600/10',
    border: 'border-green-500/20',
  },
  {
    icon: '宠',
    label: '宠物运势',
    desc: '看看你家毛孩子今日运势',
    href: '/bu/pet-fortune',
    status: 'ready',
    category: '日常',
    color: 'from-orange-500/20 to-orange-600/10',
    border: 'border-orange-500/20',
  },
  {
    icon: '色',
    label: '幸运颜色',
    desc: '每日幸运颜色，穿衣搭配',
    href: '/bu/lucky-color',
    status: 'ready',
    category: '日常',
    color: 'from-fuchsia-500/20 to-fuchsia-600/10',
    border: 'border-fuchsia-500/20',
  },
  {
    icon: '数',
    label: '幸运数字',
    desc: '每日幸运数字，趋吉避凶',
    href: '/bu/lucky-number',
    status: 'ready',
    category: '日常',
    color: 'from-cyan-500/20 to-cyan-600/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: '方',
    label: '每日吉方',
    desc: '今日吉利方向指引',
    href: '/bu/lucky-direction',
    status: 'ready',
    category: '日常',
    color: 'from-lime-500/20 to-lime-600/10',
    border: 'border-lime-500/20',
  },
  {
    icon: '八',
    label: '生辰八字',
    desc: '八字排盘，详细分析',
    href: '/bu/birth-chart',
    status: 'ready',
    category: '东方',
    color: 'from-amber-500/20 to-amber-600/10',
    border: 'border-amber-500/20',
  },
  {
    icon: '痣',
    label: '痣相分析',
    desc: '痣的位置，揭示命运',
    href: '/bu/mole',
    status: 'ready',
    category: '东方',
    color: 'from-brown-500/20 to-brown-600/10',
    border: 'border-brown-500/20',
  },
  {
    icon: '卦',
    label: '每日一卦',
    desc: '周易六十四卦，今日指引',
    href: '/bu/daily-hexagram',
    status: 'ready',
    category: '东方',
    color: 'from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: '数',
    label: '数字命理',
    desc: '生命灵数，数字能量',
    href: '/bu/numerology',
    status: 'ready',
    category: '西方',
    color: 'from-violet-500/20 to-violet-600/10',
    border: 'border-violet-500/20',
  },
  {
    icon: '配',
    label: '生肖配对',
    desc: '十二生肖，缘分天定',
    href: '/bu/zodiac-match',
    status: 'ready',
    category: '东方',
    color: 'from-pink-500/20 to-pink-600/10',
    border: 'border-pink-500/20',
  },
  {
    icon: '名',
    label: '姓名分析',
    desc: '笔画五行，解读姓名',
    href: '/bu/name',
    status: 'ready',
    category: '东方',
    color: 'from-indigo-500/20 to-indigo-600/10',
    border: 'border-indigo-500/20',
  },
  {
    icon: '风',
    label: '风水罗盘',
    desc: '方位吉凶，趋吉避凶',
    href: '/bu/fengshui',
    status: 'ready',
    category: '东方',
    color: 'from-cyan-500/20 to-cyan-600/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: '手',
    label: '手相分析',
    desc: '掌纹解析，命运在手',
    href: '/bu/palm',
    status: 'ready',
    category: '东方',
    color: 'from-teal-500/20 to-teal-600/10',
    border: 'border-teal-500/20',
  },
  {
    icon: '相',
    label: '面相分析',
    desc: '五官相学，洞察运势',
    href: '/bu/face',
    status: 'ready',
    category: '东方',
    color: 'from-rose-500/20 to-rose-600/10',
    border: 'border-rose-500/20',
  },
  {
    icon: '紫',
    label: '紫微斗数',
    desc: '星曜排盘，命格详解',
    href: '/bu/ziwei',
    status: 'ready',
    category: '东方',
    color: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/20',
  },
  {
    icon: '梦',
    label: '周公解梦',
    desc: '梦境解析，吉凶预兆',
    href: '/bu/jiemeng',
    status: 'ready',
    category: '东方',
    color: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/20',
  },
  {
    icon: '历',
    label: '今日黄历',
    desc: '择日宜忌，时辰吉凶',
    href: '/bu/huangli',
    status: 'ready',
    category: '东方',
    color: 'from-amber-500/20 to-orange-600/10',
    border: 'border-amber-500/20',
  },
  {
    icon: '塔',
    label: '塔罗占卜',
    desc: '西方塔罗，牌阵解读',
    href: '/bu/tarot',
    status: 'ready',
    category: '西方',
    color: 'from-indigo-500/20 to-indigo-600/10',
    border: 'border-indigo-500/20',
  },
  {
    icon: '谕',
    label: '神谕卡',
    desc: '灵性指引，每日启示',
    href: '/bu/oracle',
    status: 'ready',
    category: '西方',
    color: 'from-teal-500/20 to-teal-600/10',
    border: 'border-teal-500/20',
  },
]

export default function BuPage() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const categories = ['全部', '东方', '西方', '日常']

  const filtered = activeCategory === '全部'
    ? DIVINATION_TOOLS
    : DIVINATION_TOOLS.filter(tool => tool.category === activeCategory)

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
          <Link
            key={tool.label}
            href={tool.href}
            className={`moonly-card p-4 flex flex-col items-center text-center gap-2 relative overflow-hidden ${tool.border} hover:bg-white/5 transition`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl`}>
              {tool.icon}
            </div>
            <div>
              <div className="text-white font-medium text-sm">{tool.label}</div>
              <div className="text-moonly-text-muted text-xs mt-0.5">{tool.desc}</div>
            </div>
          </Link>
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
