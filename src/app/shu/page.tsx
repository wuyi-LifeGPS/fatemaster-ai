'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const BOOKS = [
  {
    title: '道德经',
    author: '老子',
    desc: '道法自然，无为而治。五千言智慧，影响东方哲学两千年。',
    tag: '道家',
    chapters: 81,
    readTime: '约 45 分钟',
    icon: '道',
  },
  {
    title: '阴符经',
    author: '黄帝',
    desc: '天性人也，人心机也。五贼在心，施行于天。',
    tag: '兵家',
    chapters: 3,
    readTime: '约 10 分钟',
    icon: '符',
  },
  {
    title: '心之力',
    author: '毛泽东',
    desc: '宇宙即我心，我心即宇宙。解读精神力量与意志的无限可能。',
    tag: '励志',
    chapters: 1,
    readTime: '约 15 分钟',
    icon: '心',
  },
  {
    title: '黄帝内经',
    author: '佚名',
    desc: '上古之人，春秋皆度百岁。中医养生智慧之源。',
    tag: '养生',
    chapters: 162,
    readTime: '精选 30 分钟',
    icon: '经',
  },
  {
    title: '周易',
    author: '伏羲/文王',
    desc: '穷理尽性以至于命。六十四卦，洞察天地变化之道。',
    tag: '易学',
    chapters: 64,
    readTime: '约 60 分钟',
    icon: '易',
  },
  {
    title: '金刚经',
    author: '释迦牟尼',
    desc: '凡所有相，皆是虚妄。破执见空，直指本心。',
    tag: '佛学',
    chapters: 32,
    readTime: '约 25 分钟',
    icon: '金',
  },
  {
    title: '心经',
    author: '玄奘译',
    desc: '色即是空，空即是色。二百六十字，般若智慧精华。',
    tag: '佛学',
    chapters: 1,
    readTime: '约 5 分钟',
    icon: '心',
  },
  {
    title: '清静经',
    author: '太上老君',
    desc: '大道无形，生育天地。清静无为，渐入真道。',
    tag: '道家',
    chapters: 1,
    readTime: '约 8 分钟',
    icon: '清',
  },
]

const DAILY_QUOTES = [
  { text: '知人者智，自知者明。', source: '道德经·第三十三章' },
  { text: '上善若水，水善利万物而不争。', source: '道德经·第八章' },
  { text: '天行健，君子以自强不息。', source: '周易·乾卦' },
  { text: '地势坤，君子以厚德载物。', source: '周易·坤卦' },
  { text: '凡所有相，皆是虚妄。', source: '金刚经' },
  { text: '色即是空，空即是色。', source: '心经' },
  { text: '大道无形，生育天地。', source: '清静经' },
  { text: '宇宙即我心，我心即宇宙。', source: '心之力' },
  { text: '上古之人，春秋皆度百岁，而动作不衰。', source: '黄帝内经·素问' },
  { text: '天性人也，人心机也。立天之道，以定人也。', source: '阴符经' },
  { text: '观天之道，执天之行，尽矣。', source: '阴符经' },
  { text: '致虚极，守静笃。', source: '道德经·第十六章' },
  { text: '大音希声，大象无形。', source: '道德经·第四十一章' },
  { text: '祸兮福之所倚，福兮祸之所伏。', source: '道德经·第五十八章' },
  { text: '合抱之木，生于毫末；九层之台，起于累土。', source: '道德经·第六十四章' },
  { text: '信言不美，美言不信。善者不辩，辩者不善。', source: '道德经·第八十一章' },
  { text: '君子终日乾乾，夕惕若厉，无咎。', source: '周易·乾卦·九三' },
  { text: '穷则变，变则通，通则久。', source: '周易·系辞下' },
  { text: '一阴一阳之谓道。', source: '周易·系辞上' },
  { text: '无平不陂，无往不复。', source: '周易·泰卦' },
]

const TAG_COLORS: Record<string, string> = {
  '道家': 'bg-teal-500/20 text-teal-300',
  '兵家': 'bg-red-500/20 text-red-300',
  '励志': 'bg-orange-500/20 text-orange-300',
  '养生': 'bg-green-500/20 text-green-300',
  '易学': 'bg-[#c9a96e]/20 text-[#c9a96e]',
  '佛学': 'bg-purple-500/20 text-purple-300',
}

export default function ShuPage() {
  const [filter, setFilter] = useState('全部')
  const filters = ['全部', '道家', '易学', '佛学', '养生', '励志']
  const [search, setSearch] = useState('')
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    const saved = localStorage.getItem('book_reading_progress')
    if (saved) setReadingProgress(JSON.parse(saved))
  }, [])

  const updateProgress = (title: string, progress: number) => {
    const next = { ...readingProgress, [title]: progress }
    setReadingProgress(next)
    localStorage.setItem('book_reading_progress', JSON.stringify(next))
  }
  const [dailyQuote, setDailyQuote] = useState(() => {
    const day = new Date().getDate()
    return DAILY_QUOTES[day % DAILY_QUOTES.length]
  })

  const filtered = BOOKS.filter(book => {
    const matchTag = filter === '全部' || book.tag === filter
    const matchSearch = search === '' || book.title.includes(search) || book.author.includes(search)
    return matchTag && matchSearch
  })

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      <h1 className="text-gold-gradient text-xl font-bold mb-2">书</h1>
      <p className="text-moonly-secondary text-sm mb-6">经典智慧，修身养性</p>

      {/* 每日一句 */}
      <div className="moonly-card p-4 mb-6 border border-[#c9a96e]/20">
        <div className="text-[10px] text-[#c9a96e] mb-2 tracking-wider">每日一句</div>
        <div className="text-white text-base leading-relaxed mb-2">
          「{dailyQuote.text}」
        </div>
        <div className="text-moonly-muted text-xs text-right">
          — {dailyQuote.source}
        </div>
      </div>

      {/* 搜索 */}
      <div className="relative mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜索书名或作者..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder:text-moonly-muted focus:outline-none focus:border-[#c9a96e]/30"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-moonly-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === f
                ? 'bg-[#c9a96e] text-moonly-bg font-semibold'
                : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 书籍列表 */}
      <div className="space-y-3">
        {filtered.map(book => (
          <Link
            key={book.title}
            href={`/shu/detail?book=${encodeURIComponent(book.title)}`}
            className="moonly-card p-4 flex items-start gap-3 group hover:bg-white/5 transition block"
          >
            <div className="w-12 h-14 rounded-lg bg-gradient-to-br from-[#c9a96e]/10 to-[#6b5b95]/5 border border-[#c9a96e]/10 flex items-center justify-center text-2xl flex-shrink-0">
              {book.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-medium text-sm">{book.title}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${TAG_COLORS[book.tag] || 'bg-white/10 text-moonly-muted'}`}>
                  {book.tag}
                </span>
              </div>
              <div className="text-moonly-muted text-xs mb-1">{book.author} · {book.chapters}章 · {book.readTime}</div>
              <div className="text-moonly-secondary text-xs leading-relaxed">{book.desc}</div>
              {readingProgress[book.title] !== undefined && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#c9a96e]">阅读进度</span>
                    <span className="text-moonly-muted">{readingProgress[book.title]}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#c9a96e] rounded-full" style={{ width: `${readingProgress[book.title]}%` }} />
                  </div>
                </div>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#c9a96e]/10 transition flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moonly-muted group-hover:text-[#c9a96e]">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-moonly-secondary text-sm">未找到相关书籍</p>
        </div>
      )}
    </div>
  )
}
