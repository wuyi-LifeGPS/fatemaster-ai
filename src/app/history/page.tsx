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
    <main className="min-h-screen">
      <header className="bg-[#0a0e27]/80 backdrop-blur-sm border-b border-white/10 text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif">
            ← AI 命理大师
          </Link>
          <h1 className="text-lg font-serif">查询历史</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {(['all', 'bazi', 'match', 'career', 'daily'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-xl p-3 text-center transition-all ${
                filter === t
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="text-2xl font-bold">{typeCounts[t]}</div>
              <div className="text-xs mt-0.5">{t === 'all' ? '全部' : getTypeLabel(t as QueryType)}</div>
            </button>
          ))}
        </div>

        {/* 操作栏 */}
        {history.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClearAll}
              className="text-sm text-red-500 hover:text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
            >
              清空全部记录
            </button>
          </div>
        )}

        {/* 记录列表 */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-400">
              {filter === 'all' ? '暂无查询记录，去试试看吧～' : `暂无「${getTypeLabel(filter)}」的记录`}
            </p>
            <Link href="/" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              返回首页 →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor(record.type)}`}>
                        {getTypeLabel(record.type)}
                      </span>
                      <span className="text-xs text-gray-400">{formatHistoryTime(record.timestamp)}</span>
                    </div>
                    <div className="font-medium text-gray-800 truncate">{record.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{record.resultSummary}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Link
                      href={`/${record.type}`}
                      className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md hover:bg-fate-200 transition-colors"
                    >
                      再次查询
                    </Link>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-xs text-gray-400 hover:text-red-500 px-2 py-1.5 transition-colors"
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
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              清空「{getTypeLabel(filter)}」的记录
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
