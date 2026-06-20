'use client'

import { useState } from 'react'
import Link from 'next/link'

const BOOKS = [
  { title: '道德经', author: '老子', desc: '道法自然，无为而治', tag: '道家' },
  { title: '阴符经', author: '黄帝', desc: '天性人也，人心机也', tag: '兵家' },
  { title: '心之力', author: '毛泽东', desc: '宇宙即我心，我心即宇宙', tag: '励志' },
  { title: '黄帝内经', author: '佚名', desc: '上古之人，春秋皆度百岁', tag: '养生' },
  { title: '周易', author: '伏羲/文王', desc: '穷理尽性以至于命', tag: '易学' },
  { title: '金刚经', author: '释迦牟尼', desc: '凡所有相，皆是虚妄', tag: '佛学' },
]

export default function ShuPage() {
  const [filter, setFilter] = useState('全部')
  const filters = ['全部', '道家', '易学', '佛学', '养生', '励志']

  const filtered = filter === '全部' ? BOOKS : BOOKS.filter(b => b.tag === filter)

  return (
    <div className="px-4 pt-4 pb-24 animate-fade-in">
      <h1 className="text-gold-gradient text-xl font-bold mb-6">书</h1>

      {/* 分类筛选 */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === f
                ? 'bg-moonly-gold text-moonly-bg font-semibold'
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
          <div key={book.title} className="moonly-card p-4 flex items-center gap-3">
            <div className="w-14 h-18 rounded-lg bg-gradient-to-br from-moonly-gold/20 to-moonly-purple/10 border border-moonly-gold/10 flex items-center justify-center text-2xl flex-shrink-0">
              📖
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">{book.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-moonly-gold/10 text-moonly-gold">{book.tag}</span>
              </div>
              <div className="text-moonly-text-muted text-xs mt-0.5">{book.author}</div>
              <div className="text-moonly-text-secondary text-xs mt-1">{book.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
