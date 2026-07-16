'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  getAllHistoryRecords,
  removeHistory,
  clearHistoryByType,
  clearAllHistory,
  formatHistoryTime,
  getTypeLabel,
  getTypeColor,
  type QueryType,
  type HistoryRecord,
} from '@/lib/history'

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [filter, setFilter] = useState<QueryType | 'all'>('all')

  useEffect(() => {
    setHistory(getAllHistoryRecords())
  }, [])

  const filtered = filter === 'all' ? history : history.filter((r) => r.type === filter)

  const handleDelete = (id: string) => {
    removeHistory(id)
    setHistory(getAllHistoryRecords())
  }

  const handleClearType = (type: QueryType) => {
    if (confirm(`确定要清空「${getTypeLabel(type)}」的所有记录吗？`)) {
      clearHistoryByType(type)
      setHistory(getAllHistoryRecords())
    }
  }

  const handleClearAll = () => {
    if (confirm('确定要清空所有查询记录吗？此操作不可恢复。')) {
      clearAllHistory()
      setHistory([])
    }
  }

  const typeCounts: Record<string, number> = {
    all: history.length,
    bazi: history.filter((r) => r.type === 'bazi').length,
    match: history.filter((r) => r.type === 'match').length,
    career: history.filter((r) => r.type === 'career').length,
    daily: history.filter((r) => r.type === 'daily').length,
  }

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/wo" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-gold-gradient text-xl font-bold">查询历史</h1>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {(['all', 'bazi', 'match', 'career', 'daily'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`moonly-card p-3 text-center transition-all ${
              filter === t
                ? 'border-[#c9a96e]/40 bg-[#c9a96e]/10'
                : ''
            }`}
          >
            <div className="text-xl font-bold text-white">{typeCounts[t]}</div>
            <div className="text-xs text-moonly-muted mt-0.5">{t === 'all' ? '全部' : getTypeLabel(t as QueryType)}</div>
          </button>
        ))}
      </div>

      {/* 操作栏 */}
      {history.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleClearAll}
            className="text-sm text-red-400 hover:text-red-300 px-3 py-1.5 rounded-md hover:bg-red-400/10 transition-colors"
          >
            清空全部记录
          </button>
        </div>
      )}

      {/* 记录列表 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3 text-moonly-muted">📭</div>
          <p className="text-moonly-secondary">
            {filter === 'all' ? '暂无查询记录，去试试看吧～' : `暂无「${getTypeLabel(filter)}」的记录`}
          </p>
          <Link href="/" className="text-[#c9a96e] hover:underline text-sm mt-2 inline-block">
            返回首页 →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((record) => (
            <div
              key={record.id}
              className="moonly-card p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor(record.type)}`}>
                      {getTypeLabel(record.type)}
                    </span>
                    <span className="text-xs text-moonly-muted">{formatHistoryTime(record.timestamp)}</span>
                  </div>
                  <div className="font-medium text-white text-sm truncate">{record.title}</div>
                  <div className="text-sm text-moonly-secondary mt-0.5">{record.resultSummary}</div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <Link
                    href={`/${record.type}`}
                    className="text-xs bg-[#c9a96e]/10 text-[#c9a96e] px-3 py-1.5 rounded-md hover:bg-[#c9a96e]/20 transition-colors"
                  >
                    再次查询
                  </Link>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-xs text-moonly-muted hover:text-red-400 px-2 py-1.5 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 按类型清空 */}
      {history.length > 0 && filter !== 'all' && typeCounts[filter] > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => handleClearType(filter)}
            className="text-sm text-moonly-muted hover:text-red-400 transition-colors"
          >
            清空「{getTypeLabel(filter)}」的记录
          </button>
        </div>
      )}
    </div>
  )
}
