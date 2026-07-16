'use client'

import { useState, useCallback, useMemo } from 'react'
import { hapticMedium } from '@/lib/haptic'
import { showToast } from '@/components/Toast'

const FORTUNE_STICKS = [
  { level: '上上签', emoji: '🌟', text: '时来运转，诸事顺遂。', poem: '乌云散尽月重明，枯木逢春再发芽。' },
  { level: '上签', emoji: '⭐', text: '吉星高照，心想事成。', poem: '春风得意马蹄疾，一日看尽长安花。' },
  { level: '中上签', emoji: '✨', text: '平安顺遂，小有收获。', poem: '柳暗花明又一村，守得云开见月明。' },
  { level: '中签', emoji: '🌙', text: '平平淡淡，无惊无喜。', poem: '平平淡淡才是真，细水长流福自来。' },
  { level: '中下签', emoji: '☁️', text: '稍有波折，谨慎行事。', poem: '山重水复疑无路，小心驶得万年船。' },
  { level: '下签', emoji: '🌧️', text: '运势低迷，宜静不宜动。', poem: '风雨过后见彩虹，静待时机莫强求。' },
]

interface StickRecord {
  date: string // YYYY-MM-DD
  level: string
  emoji: string
  text: string
  poem: string
}

const STORAGE_KEY = 'lifegps_fortune_sticks'

function loadRecords(): StickRecord[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveRecord(record: StickRecord) {
  if (typeof window === 'undefined') return
  const records = loadRecords()
  // Remove duplicate for same date
  const filtered = records.filter(r => r.date !== record.date)
  filtered.unshift(record)
  // Keep last 30
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 30)))
}

function getTodayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function FortuneStick() {
  const [records, setRecords] = useState<StickRecord[]>(() => loadRecords())
  const [drawn, setDrawn] = useState(false)
  const [stick, setStick] = useState<typeof FORTUNE_STICKS[0] | null>(null)
  const [shaking, setShaking] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const todayStr = getTodayStr()
  const todayRecord = records.find(r => r.date === todayStr)

  const drawStick = useCallback(() => {
    if (shaking) return
    if (todayRecord && !drawn) {
      showToast('今日已求过签，明日再来吧～', 'info')
      return
    }

    hapticMedium()
    setShaking(true)
    setDrawn(false)
    setStick(null)

    setTimeout(() => {
      const randomStick = FORTUNE_STICKS[Math.floor(Math.random() * FORTUNE_STICKS.length)]
      setStick(randomStick)
      setDrawn(true)
      setShaking(false)

      const record: StickRecord = {
        date: todayStr,
        level: randomStick.level,
        emoji: randomStick.emoji,
        text: randomStick.text,
        poem: randomStick.poem,
      }
      saveRecord(record)
      setRecords(prev => [record, ...prev.filter(r => r.date !== todayStr)])
      showToast(`抽到了${randomStick.level}！`, 'success')
    }, 1500)
  }, [shaking, todayRecord, drawn, todayStr])

  // Show today's saved result on mount
  const displayStick = useMemo(() => {
    if (stick) return stick
    if (todayRecord) return todayRecord
    return null
  }, [stick, todayRecord])

  const hasResult = drawn || !!todayRecord

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎋</span>
          <h3 className="text-gold text-sm font-semibold">每日求签</h3>
        </div>
        {records.length > 0 && (
          <button
            onClick={() => setShowHistory(v => !v)}
            className="text-[10px] text-moonly-muted hover:text-white/60 px-2 py-1 rounded bg-white/5 transition-colors"
          >
            {showHistory ? '收起' : '历史'}
          </button>
        )}
      </div>

      {!hasResult ? (
        <div className="text-center py-6">
          <div
            className={`w-20 h-20 rounded-full bg-gold/10 mx-auto mb-4 flex items-center justify-center text-4xl cursor-pointer transition-transform ${shaking ? 'animate-shake' : 'hover:scale-105'}`}
            onClick={drawStick}
          >
            {shaking ? '🎋' : '🙏'}
          </div>
          <p className="text-white/60 text-sm">
            {shaking ? '摇签中...' : '点击求签'}
          </p>
          {todayRecord && (
            <p className="text-[10px] text-moonly-muted mt-2">今日已求签，点击查看结果</p>
          )}
        </div>
      ) : (
        <div className="text-center py-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-gold/20 mx-auto mb-3 flex items-center justify-center text-3xl">
            {displayStick?.emoji}
          </div>
          <p className="text-gold font-bold text-lg mb-1">{displayStick?.level}</p>
          <p className="text-white/80 text-sm mb-2">{displayStick?.text}</p>
          <p className="text-moonly-muted text-xs italic">{displayStick?.poem}</p>

          {todayRecord ? (
            <p className="text-[10px] text-moonly-muted mt-3">今日已求签，明日再来吧～</p>
          ) : (
            <button
              onClick={drawStick}
              className="mt-4 px-4 py-2 rounded-full bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors"
            >
              再求一签
            </button>
          )}
        </div>
      )}

      {/* History */}
      {showHistory && records.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5 animate-fade-in">
          <p className="text-[10px] text-moonly-muted mb-2">最近求签记录</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {records.slice(0, 7).map(r => (
              <div key={r.date} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                <span className="text-lg">{r.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/80">{r.level}</p>
                  <p className="text-[10px] text-moonly-muted truncate">{r.text}</p>
                </div>
                <span className="text-[10px] text-moonly-muted shrink-0">{r.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
