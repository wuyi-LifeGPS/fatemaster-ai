'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { hapticLight } from '@/lib/haptic'

interface KnowledgeItem {
  id: string
  title: string
  category: string
  icon: string
  content: string
  tags: string[]
}

const KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'tiangan',
    title: '天干地支',
    category: '基础',
    icon: '☯️',
    content: '天干有十个：甲、乙、丙、丁、戊、己、庚、辛、壬、癸。地支有十二个：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥。天干地支组合形成六十甲子，用于纪年、纪月、纪日、纪时。',
    tags: ['天干', '地支', '六十甲子']
  },
  {
    id: 'wuxing',
    title: '五行生克',
    category: '基础',
    icon: '🌊',
    content: '五行包括金、木、水、火、土。相生关系：木生火，火生土，土生金，金生水，水生木。相克关系：木克土，土克水，水克火，火克金，金克木。五行平衡是命理分析的核心。',
    tags: ['五行', '生克', '平衡']
  },
  {
    id: 'tianshi',
    title: '十神详解',
    category: '基础',
    icon: '⭐',
    content: '十神以日干为中心：比肩、劫财、食神、伤官、偏财、正财、七杀、正官、偏印、正印。十神代表不同的人事关系和性格特征，是八字分析的重要工具。',
    tags: ['十神', '性格', '关系']
  },
  {
    id: 'dayun',
    title: '大运流年',
    category: '进阶',
    icon: '🌊',
    content: '大运每十年一变，是人生运势的大周期。流年是每年的运势变化。大运与流年结合，可以分析特定时期的吉凶祸福。大运顺逆排法根据年柱天干阴阳和性别决定。',
    tags: ['大运', '流年', '运势周期']
  },
  {
    id: 'sizhu',
    title: '四柱八字',
    category: '基础',
    icon: '📐',
    content: '四柱即年柱、月柱、日柱、时柱，每柱由一个天干和一个地支组成，共八个字，故称八字。日柱天干为日主，代表命主本人。四柱八字是命理学的核心框架。',
    tags: ['四柱', '日主', '命局']
  },
  {
    id: 'yongshen',
    title: '用神喜忌',
    category: '进阶',
    icon: '🎯',
    content: '用神是八字中对日主最有利的五行。喜神是生助用神的五行，忌神是克制用神的五行。找准用神是命理分析的关键，可以指导人生决策和趋吉避凶。',
    tags: ['用神', '喜忌', '补救']
  },
  {
    id: 'bazihehun',
    title: '八字合婚',
    category: '应用',
    icon: '💑',
    content: '八字合婚通过分析双方八字的五行互补、十神配合、大运同步等因素，判断婚姻匹配度。重点关注日柱天干地支的合冲关系，以及双方用神的互补性。',
    tags: ['合婚', '婚姻', '匹配']
  },
  {
    id: 'caiyun',
    title: '财运分析',
    category: '应用',
    icon: '💰',
    content: '正财代表稳定收入，偏财代表意外之财。财星为用神且旺相时，财运亨通。大运流年遇到财星，往往是求财的好时机。但财多身弱反而为祸。',
    tags: ['财运', '正财', '偏财']
  },
  {
    id: 'shiye',
    title: '事业方向',
    category: '应用',
    icon: '💼',
    content: '官杀代表事业和权力，印绶代表学业和贵人。根据八字用神选择适合的行业：用神为金适合金融，为木适合教育，为水适合物流，为火适合文化，为土适合房地产。',
    tags: ['事业', '职业', '行业']
  },
  {
    id: 'jiankang',
    title: '健康提示',
    category: '应用',
    icon: '🏥',
    content: '五行对应人体脏腑：木主肝胆，火主心小肠，土主脾胃，金主肺大肠，水主肾膀胱。某五行过旺或过弱，对应脏腑容易出现问题，可通过养生调理平衡。',
    tags: ['健康', '脏腑', '养生']
  },
]

const CATEGORIES = ['全部', '基础', '进阶', '应用']

export default function AcademyPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')

  const filtered = useMemo(() => {
    return KNOWLEDGE_BASE.filter(item => {
      const matchCategory = activeCategory === '全部' || item.category === activeCategory
      const matchSearch = !search || 
        item.title.includes(search) || 
        item.content.includes(search) ||
        item.tags.some(t => t.includes(search))
      return matchCategory && matchSearch
    })
  }, [search, activeCategory])

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/ming" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-gold-gradient text-xl font-bold">命理学堂</h1>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="搜索命理知识..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/50"
        />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
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

      {/* Knowledge Cards */}
      <div className="space-y-3">
        {filtered.map(item => (
          <KnowledgeCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl">📚</span>
          <p className="text-white/40 text-sm mt-2">暂无相关知识</p>
        </div>
      )}
    </div>
  )
}

function KnowledgeCard({ item }: { item: KnowledgeItem }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{item.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-medium text-sm">{item.title}</h3>
            <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-moonly-muted">
              {item.category}
            </span>
          </div>
          <p className={`text-xs text-white/60 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {item.content}
          </p>
          {item.content.length > 60 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gold text-xs mt-1 hover:underline"
            >
              {expanded ? '收起' : '展开'}
            </button>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-gold/10 text-[10px] text-gold/80">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
