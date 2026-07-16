'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { hapticLight } from '@/lib/haptic'

interface SearchItem {
  label: string
  href: string
  category: string
  keywords: string[]
}

const SEARCH_ITEMS: SearchItem[] = [
  { label: '八字分析', href: '/bazi', category: '命理', keywords: ['八字', '命盘', '四柱', 'bazi'] },
  { label: '合婚分析', href: '/match', category: '命理', keywords: ['合婚', '婚姻', '配对', 'match'] },
  { label: '事业合作', href: '/career', category: '命理', keywords: ['事业', '工作', '合作', 'career'] },
  { label: '天赋分析', href: '/talent', category: '命理', keywords: ['天赋', '才能', 'talent'] },
  { label: '姓名学', href: '/naming', category: '命理', keywords: ['起名', '姓名', 'naming'] },
  { label: '每日运势', href: '/daily', category: '命理', keywords: ['日运', '每日', 'daily'] },
  { label: 'AI 命理师', href: '/bu/chat', category: '卜卦', keywords: ['AI', '聊天', 'chat', '命理师'] },
  { label: '塔罗占卜', href: '/bu/tarot', category: '卜卦', keywords: ['塔罗', 'tarot', '占卜'] },
  { label: '铜钱起卦', href: '/bu/coin', category: '卜卦', keywords: ['铜钱', 'coin', '起卦'] },
  { label: '命盘首页', href: '/ming', category: '命理', keywords: ['命盘', 'ming', '首页'] },
  { label: '历史记录', href: '/history', category: '系统', keywords: ['历史', '记录', 'history'] },
  { label: '设置', href: '/settings', category: '系统', keywords: ['设置', 'settings', '配置'] },
  { label: '我的', href: '/wo', category: '系统', keywords: ['我的', '个人', 'wo', 'profile'] },
]

const HISTORY_KEY = 'lifegps_search_history'
const MAX_HISTORY = 8

function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

function addSearchHistory(query: string) {
  const history = getSearchHistory()
  const newHistory = [query, ...history.filter(h => h !== query)].slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
}

function clearSearchHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [history, setHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setHistory(getSearchHistory())
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const q = query.toLowerCase()
    const filtered = SEARCH_ITEMS.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.keywords.some(k => k.toLowerCase().includes(q))
    )
    setResults(filtered)
  }, [query])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setIsOpen(prev => !prev)
    }
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleResultClick = (item: SearchItem) => {
    hapticLight()
    if (query.trim()) {
      addSearchHistory(query.trim())
    }
    setIsOpen(false)
  }

  const handleHistoryClick = (term: string) => {
    hapticLight()
    setQuery(term)
  }

  const handleClearHistory = () => {
    hapticLight()
    clearSearchHistory()
    setHistory([])
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          hapticLight()
          setIsOpen(true)
        }}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition"
        title="搜索 (Ctrl+K)"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </button>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[201] bg-[#1a1428] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-scale">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moonly-muted flex-shrink-0">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索功能..."
            className="flex-1 bg-transparent text-white text-sm placeholder:text-moonly-muted focus:outline-none"
          />
          <span className="text-xs text-moonly-muted flex-shrink-0 bg-white/5 px-2 py-1 rounded">ESC</span>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleResultClick(item)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition"
                >
                  <span className="text-xs text-gold bg-gold/10 px-2 py-0.5 rounded flex-shrink-0">{item.category}</span>
                  <span className="text-sm text-white">{item.label}</span>
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-8 text-center">
              <p className="text-moonly-muted text-sm">未找到相关功能</p>
            </div>
          ) : (
            <div className="p-2">
              {/* 搜索历史 */}
              {history.length > 0 && (
                <>
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-xs text-moonly-muted">搜索历史</p>
                    <button
                      onClick={handleClearHistory}
                      className="text-xs text-white/30 hover:text-white/60 transition"
                    >
                      清除
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 px-3 pb-2">
                    {history.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleHistoryClick(term)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/70 hover:bg-white/10 hover:text-white transition"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <p className="text-xs text-moonly-muted px-3 py-2">热门功能</p>
              {SEARCH_ITEMS.slice(0, 6).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition"
                >
                  <span className="text-xs text-gold bg-gold/10 px-2 py-0.5 rounded flex-shrink-0">{item.category}</span>
                  <span className="text-sm text-white">{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
