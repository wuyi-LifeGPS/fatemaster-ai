'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const MEDITATION_CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'sleep', label: '助眠' },
  { key: 'focus', label: '专注' },
  { key: 'heal', label: '疗愈' },
  { key: 'energy', label: '能量' },
]

const MEDITATIONS = [
  {
    id: 'sleep-intro',
    title: '睡前放松',
    tag: '助眠',
    duration: 15,
    icon: '月',
    desc: '释放一天的疲惫，进入深度睡眠',
    plays: 12840,
  },
  {
    id: 'focus-breath',
    title: '呼吸专注',
    tag: '专注',
    duration: 10,
    icon: '息',
    desc: '觉察呼吸，回归当下',
    plays: 8932,
  },
  {
    id: 'body-scan',
    title: '身体扫描',
    tag: '疗愈',
    duration: 20,
    icon: '体',
    desc: '从头到脚，感受身体的每一个信号',
    plays: 6541,
  },
  {
    id: 'chakra',
    title: '七脉轮净化',
    tag: '能量',
    duration: 25,
    icon: '轮',
    desc: '激活七轮能量，平衡身心',
    plays: 4320,
  },
  {
    id: 'higher-self',
    title: '与高我连接',
    tag: '疗愈',
    duration: 27,
    icon: '我',
    desc: '向内探索，连接内在智慧',
    plays: 3890,
  },
  {
    id: 'morning',
    title: '晨间唤醒',
    tag: '能量',
    duration: 8,
    icon: '晨',
    desc: '开启充满活力的一天',
    plays: 7650,
  },
]

const SOUND_THERAPY = [
  {
    title: '432Hz 自然音疗',
    duration: 30,
    icon: '频',
    desc: '宇宙频率，深层放松',
  },
  {
    title: '颂钵疗愈',
    duration: 20,
    icon: '钵',
    desc: '古老颂钵，振动身心',
  },
  {
    title: '雨声白噪音',
    duration: 60,
    icon: '雨',
    desc: '自然雨声，助眠专注',
  },
]

export default function XiuPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTab, setActiveTab] = useState<'meditation' | 'sound'>('meditation')
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('meditation_favorites')
    if (saved) setFavorites(JSON.parse(saved))
  }, [])

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id]
    setFavorites(next)
    localStorage.setItem('meditation_favorites', JSON.stringify(next))
  }

  const filtered = activeCategory === 'all'
    ? MEDITATIONS
    : MEDITATIONS.filter(m => m.tag === MEDITATION_CATEGORIES.find(c => c.key === activeCategory)?.label)

  return (
    <div className="px-4 pt-4 pb-24 animate-fade-in">
      <h1 className="text-gold-gradient text-xl font-bold mb-2">修</h1>
      <p className="text-moonly-text-secondary text-sm mb-6">正念冥想，回归内心</p>

      {/* 顶部 Tab */}
      <div className="flex gap-1 mb-6 bg-white/5 rounded-full p-1">
        <button
          onClick={() => setActiveTab('meditation')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeTab === 'meditation'
              ? 'bg-moonly-gold text-moonly-bg font-semibold'
              : 'text-moonly-text-secondary hover:text-white'
          }`}
        >
          冥想
        </button>
        <button
          onClick={() => setActiveTab('sound')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeTab === 'sound'
              ? 'bg-moonly-gold text-moonly-bg font-semibold'
              : 'text-moonly-text-secondary hover:text-white'
          }`}
        >
          声音
        </button>
      </div>

      {activeTab === 'meditation' ? (
        <>
          {/* 分类筛选 */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
            {MEDITATION_CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeCategory === cat.key
                    ? 'bg-moonly-gold text-moonly-bg font-semibold'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 今日推荐 */}
          <div className="moonly-card p-5 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-moonly-gold/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="text-xs text-moonly-gold mb-1">今日推荐</div>
              <h2 className="text-white font-bold text-lg mb-1">冥想入门</h2>
              <p className="text-moonly-text-secondary text-sm mb-4">从零开始，建立冥想习惯</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-moonly-text-muted">热门 · 13 分钟</span>
              </div>
              <button className="mt-4 btn-gold px-6 py-2 text-sm font-semibold w-full">
                开始冥想
              </button>
            </div>
          </div>

          {/* 冥想列表 */}
          <div className="space-y-3">
            {filtered.map(item => (
              <div key={item.id} className="moonly-card p-3 flex items-center gap-3 group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-moonly-gold/10 to-moonly-purple/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm truncate">{item.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-moonly-text-muted flex-shrink-0">
                      {item.tag}
                    </span>
                  </div>
                  <div className="text-moonly-text-muted text-xs mt-0.5">{item.desc}</div>
                  <div className="text-moonly-text-muted text-xs mt-1">
                    {item.duration} 分钟 · {item.plays.toLocaleString()} 次播放
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                      favorites.includes(item.id)
                        ? 'bg-moonly-gold/20 text-moonly-gold'
                        : 'bg-white/5 text-moonly-text-muted hover:bg-white/10'
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={favorites.includes(item.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                  <div className="w-8 h-8 rounded-full bg-moonly-gold/10 flex items-center justify-center group-hover:bg-moonly-gold/20 transition">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-moonly-gold">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* 音疗列表 */}
          <div className="space-y-3">
            {SOUND_THERAPY.map(item => (
              <div key={item.title} className="moonly-card p-3 flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{item.title}</div>
                  <div className="text-moonly-text-muted text-xs mt-0.5">{item.desc}</div>
                  <div className="text-moonly-text-muted text-xs mt-1">{item.duration} 分钟</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-moonly-gold/10 flex items-center justify-center hover:bg-moonly-gold/20 transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-moonly-gold">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
